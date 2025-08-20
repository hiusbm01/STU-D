package com.stud.backend.service;

import com.stud.backend.domain.Seat;
import com.stud.backend.domain.SeatStatus;
import com.stud.backend.domain.User;
import com.stud.backend.dto.SeatDto;
import com.stud.backend.repository.SeatRepository;
import com.stud.backend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final UserRepository userRepository;


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
        //사용자가 다른 좌석을 사용중인지 확인
        seatRepository.findByUserAndStatus(user,SeatStatus.OCCUPIED)
                .ifPresent(existingSeat ->{
                    throw new IllegalStateException("이미 예약한 좌석이 있습니다." +existingSeat.getSeatNumber());
                });

        //좌석 상태 확인
        if(seat.getStatus() != SeatStatus.AVAILABLE){
            throw new IllegalStateException("이미 사용 중이거나 예약 불가능한 좌석입니다.");
        }
        //좌석 정보 업데이트
        seat.setStatus(SeatStatus.OCCUPIED); //상태 사용중으로 변경
        seat.setUser(user); //좌석에 사용자 정보 연결
        seat.setStartTime(LocalDateTime.now()); //시작 시간 기록
        seat.setEndTime(LocalDateTime.now().plusHours(2)); //2시간 후를 종료 시간으로 설정 (임시)

    }
    //예약 취소
    public void checkout(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다"));

        Seat seat = seatRepository.findByUserAndStatus(user, SeatStatus.OCCUPIED)
                .orElseThrow(() -> new IllegalStateException("현재 예약된 좌석이 없습니다"));

        seat.setStatus(SeatStatus.AVAILABLE);
        seat.setUser(null);
        seat.setStartTime(null);
        seat.setEndTime(null);
    }

    //내 예약 찾기
    @Transactional(readOnly = true)
    public SeatDto getMyReservation(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다"));

        //사용자가 사용중인 좌석을 찾아 DTO로 변환하여 반환
        return seatRepository.findByUserAndStatus(user, SeatStatus.OCCUPIED)
                .map(SeatDto::new)//좌석이 있으면 SeatDto로 반환, 없으면 null
                .orElse(null);
    }


}


