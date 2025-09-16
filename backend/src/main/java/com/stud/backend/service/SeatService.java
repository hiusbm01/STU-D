package com.stud.backend.service;

import com.stud.backend.domain.*;
import com.stud.backend.dto.*;
import com.stud.backend.exception.TicketNotFoundException;
import com.stud.backend.repository.SeatRepository;
import com.stud.backend.repository.SeatUsageHistoryRepository;
import com.stud.backend.repository.UserRepository;
import com.stud.backend.repository.UserTicketRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final UserTicketRepository userTicketRepository;
    private final SeatUsageHistoryRepository seatUsageHistoryRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private void broadcastSeatUpdate(){
        List<SeatDto> seats = getAllSeats();
        messagingTemplate.convertAndSend("/topic/seats", seats);
    }


    @PostConstruct
    public void initSeats(){
        //시작 시 테스트용 좌석 생성 로직
        if(seatRepository.count() == 0){
            for(int i=1; i<=10; i++){
                Seat seat = new Seat();
                seat.setSeatNumber("A" + i);
                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);
            }
        }
    }
    @Transactional(readOnly = true)
    public List<SeatDto> getAllSeats(){
        return seatRepository.findAll().stream()
                .map(SeatDto::new)// .map(seat -> new SeatDto(seat))랑 동일
                .collect(Collectors.toList());
    }

    public void reserveSeat(Long seatId, String userEmail){
        //예약하려는 좌석 조회
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() ->new IllegalArgumentException("해당 좌석이 존재하지 않습니다."));

        //요청 보낸 사용자 DB 조회
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        UserTicket ticketToUse = userTicketRepository.findByUserAndStatus(user, UserTicketStatus.ACTIVE)
                        .stream()
                                .min(Comparator.comparing(UserTicket::getPurchaseDate))
                                        .orElseThrow(() -> new TicketNotFoundException("사용 가능한 이용권이 없습니다."));
        //사용자가 다른 좌석을 사용중인지 확인
        seatRepository.findByUserAndStatus(user,SeatStatus.OCCUPIED)
                .stream().findFirst().ifPresent(existingSeat ->{
                    throw new IllegalStateException("이미 예약한 좌석이 있습니다." +existingSeat.getSeatNumber());
                });

        //좌석 상태 확인
        if(seat.getStatus() != SeatStatus.AVAILABLE){
            throw new IllegalStateException("이미 사용 중이거나 예약 불가능한 좌석입니다.");
        }

        int remainingMinutes = ticketToUse.getRemainingTime();
        if(remainingMinutes <= 0){
            throw new IllegalStateException("이용권의 남은 시간이 없습니다");
        }

        //좌석 정보 업데이트
        seat.setStatus(SeatStatus.OCCUPIED); //상태 사용중으로 변경
        seat.setUser(user); //좌석에 사용자 정보 연결
        seat.setUserTicket(ticketToUse);
        seat.setStartTime(LocalDateTime.now()); //시작 시간 기록
        seat.setEndTime(LocalDateTime.now().plusMinutes(remainingMinutes)); //이용권 시간 만큼 종료 시간 증가

        broadcastSeatUpdate();
        seatRepository.save(seat);

    }
    //퇴실
    public CheckoutResponseDto checkout(String userEmail){
       User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

       //사용자 사용중인 좌석 찾기
        Seat seat = seatRepository.findByUserAndStatus(user, SeatStatus.OCCUPIED).stream().findFirst().orElseThrow(() -> new IllegalStateException("현재 사용중인 좌석이 없습니다."));


        //사용자가 사용중인 'ACTIVE'상태 이용권 찾기
        UserTicket activeUserTicket = seat.getUserTicket();
        //이용 기록 생성 및 저장
        SeatUsageHistory history = new SeatUsageHistory();
        history.setUser(user);
        history.setSeatNumber(seat.getSeatNumber());
        history.setCheckInTime(seat.getStartTime());
        history.setCheckOutTime(LocalDateTime.now());

        long duration = Duration.between(seat.getStartTime(), history.getCheckOutTime()).toMinutes();
        history.setDurationMinutes(duration);

        seatUsageHistoryRepository.save(history);

        //사용 시간 계산 및 이용권 시간 차감
        if(activeUserTicket != null && activeUserTicket.getTicket().getType() != TicketType.PERIOD){

            int remainingTime = activeUserTicket.getRemainingTime();
            activeUserTicket.setRemainingTime(remainingTime - (int) duration);

            if( activeUserTicket.getRemainingTime() <= 0){
                activeUserTicket.setStatus(UserTicketStatus.USED);
            }
        }
        // 좌석 정보 초기화
        seat.setStatus(SeatStatus.AVAILABLE);
        seat.setUser(null);
        seat.setStartTime(null);
        seat.setEndTime(null);
        seat.setUserTicket(null);
        //@Transactional에 의해 변경된 Seat와 UserTicket의 정보가 자동으로 DB저장.

        seatRepository.save(seat);
        broadcastSeatUpdate();

        return new CheckoutResponseDto(duration, activeUserTicket);

    }

    //내 예약 찾기
    @Transactional(readOnly = true)
    public SeatDto getMyReservation(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다"));

        //사용자가 사용중인 좌석을 찾아 DTO로 변환하여 반환
        return seatRepository.findByUserAndStatus(user, SeatStatus.OCCUPIED)
                .stream().findFirst().map(SeatDto::new)//좌석이 있으면 SeatDto로 반환, 없으면 null
                .orElse(null);
    }

    @Scheduled(fixedRate = 60000)//1분마다 이 메서드 실행
    @Transactional
    public void autoCheckoutExpiredSeats(){
        System.out.println("만료된 좌석을 확인합니다." + LocalDateTime.now());

        List<Seat> expiredSeats = seatRepository.findByStatusAndEndTimeBefore(SeatStatus.OCCUPIED, LocalDateTime.now());

        if(!expiredSeats.isEmpty()){
            System.out.println(expiredSeats.size() + "개의 만료된 좌석을 발견하여 퇴실처리합니다.");
            for(Seat seat : expiredSeats){
                User user = seat.getUser();
                if(user != null){
                    UserTicket activeTicket = userTicketRepository.findByUserAndStatus(user, UserTicketStatus.ACTIVE)
                            .stream().findFirst().orElse(null);

                    if(activeTicket != null && activeTicket.getTicket().getType() != TicketType.PERIOD){
                        activeTicket.setRemainingTime(0);
                        activeTicket.setStatus(UserTicketStatus.USED);
                    }
                    seat.setStatus(SeatStatus.AVAILABLE);
                    seat.setUser(null);
                    seat.setStartTime(null);
                    seat.setEndTime(null);
                }
            }
            broadcastSeatUpdate();
        }




    }

    @Transactional(readOnly = true)
    public List<SeatUsageHistoryDto> getMySeatUsageHistory(String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        List<SeatUsageHistory> histories = seatUsageHistoryRepository.findByUser(user);

        return histories.stream()
                .map(SeatUsageHistoryDto::new)
                .collect(Collectors.toList());

    }
    public Optional<SeatDto> getMyActiveSeat(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        return seatRepository.findByUserAndStatus(user, SeatStatus.OCCUPIED)
                .stream().findFirst().map(SeatDto::new);
    }

    //자리 이동 메소드
    @Transactional
    public void changeSeat(Long newSeatId, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        //1. 현재 사용중 좌석 찾음
        Seat oldSeat = seatRepository.findByUserAndStatus(user, SeatStatus.OCCUPIED)
                .stream().findFirst().orElseThrow(()-> new IllegalStateException("현재 사용중인 좌석이 없습니다."));

        //옮길 좌석 찾기
        Seat newSeat = seatRepository.findById(newSeatId)
                .orElseThrow(()-> new IllegalArgumentException("옮길 좌석이 존재하지 않습니다."));

        //사용 가능한지 확인
        if(newSeat.getStatus() != SeatStatus.AVAILABLE){
            throw new IllegalStateException("이미 사용중이거나 예약 불가능한 좌석입니다.");
        }
        //기존 좌석 비우고 새로운 좌석에 정보 그대로 옮기기

        newSeat.setStatus(SeatStatus.OCCUPIED);
        newSeat.setUser(user);
        newSeat.setStartTime(oldSeat.getStartTime());
        newSeat.setEndTime(oldSeat.getEndTime());
        newSeat.setUserTicket(oldSeat.getUserTicket());

        oldSeat.setStatus(SeatStatus.AVAILABLE);
        oldSeat.setUser(null);
        oldSeat.setStartTime(null);
        oldSeat.setEndTime(null);
        oldSeat.setUserTicket(null);

        seatRepository.saveAll(Arrays.asList(oldSeat, newSeat));
    }

    //메인메뉴 좌석개수 띄우기
    @Transactional(readOnly = true)
    public DashboardDto getDashboardInfo() {
        long totalSeats = seatRepository.count();
        long occupiedSeats = seatRepository.countByStatus(SeatStatus.OCCUPIED);
        long availableSeats = totalSeats - occupiedSeats;

        return new DashboardDto(totalSeats, occupiedSeats, availableSeats);
    }


    //대시보드 용 최근 기록 1개 가져오는 메서드
    @Transactional(readOnly = true)
    public Optional<SeatUsageHistoryDto> getMyRecentUsageHistory(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        return seatUsageHistoryRepository.findFirstByUserOrderByCheckOutTimeDesc(user)
                .map(SeatUsageHistoryDto::new);
    }


}


