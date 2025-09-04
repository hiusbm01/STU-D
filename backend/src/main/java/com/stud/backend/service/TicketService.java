package com.stud.backend.service;

import com.stud.backend.domain.*;
import com.stud.backend.dto.TicketDto;
import com.stud.backend.dto.UserTicketDto;
import com.stud.backend.repository.TicketRepository;
import com.stud.backend.repository.UserRepository;
import com.stud.backend.repository.UserTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final UserTicketRepository userTicketRepository;

    @Transactional(readOnly = true)
    public List<TicketDto> getAllTickets(){
        return ticketRepository.findAll().stream().map(TicketDto::new).collect(Collectors.toList());

    }

    public void purchaseTicket(Long ticketId, String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Ticket ticketToPurchase = ticketRepository.findById(ticketId).orElseThrow(() -> new IllegalArgumentException("이용권을 찾을 수 없습니다"));

        TicketType purchaseType = ticketToPurchase.getType();
        List<UserTicket> activeTickets = userTicketRepository.findByUserAndStatus(user, UserTicketStatus.ACTIVE);

        //기간권을 이용중인지 확인.
        boolean hasPeriodTicket = activeTickets.stream()
                .anyMatch(e -> e.getTicket().getType() == TicketType.PERIOD);

        //1. 기간권 사용중 -> 다른 이용권 구매불가
        if(hasPeriodTicket) {
            throw new IllegalStateException("이미 기간권을 사용 중입니다.");
        }
        //2. 다른 이용권 사용중 -> 기간권 구매 불가
        if(purchaseType == TicketType.PERIOD && !activeTickets.isEmpty()){
                throw new IllegalStateException("다른 활성 이용권이 존재하여 기간권을 구매할 수 없습니다.");
        }

        Optional<UserTicket> sameTypeTicket = activeTickets.stream()
                .filter(e -> e.getTicket().getType() == purchaseType)
                .findFirst();

        if(sameTypeTicket.isPresent()){
            UserTicket activeTicket = sameTypeTicket.get();

            if(purchaseType == TicketType.HOURLY || purchaseType == TicketType.FIXED){
                int newRemainingTime = activeTicket.getRemainingTime() + (ticketToPurchase.getDurationHours() * 60);
                activeTicket.setRemainingTime(newRemainingTime);
            }
            LocalDateTime newExpiryDate = LocalDateTime.now().plusDays(ticketToPurchase.getDurationDays());
            if(activeTicket.getExpiryDate().isBefore(newExpiryDate)){
                activeTicket.setExpiryDate(newExpiryDate);
            }

            userTicketRepository.save(activeTicket);
        }  else{
            createNewUserTicket(user, ticketToPurchase);
        }
    }

    private void createNewUserTicket(User user, Ticket ticketToPurchase){
        UserTicket newUserTicket = new UserTicket();
        newUserTicket.setUser(user);
        newUserTicket.setTicket(ticketToPurchase);
        newUserTicket.setPurchaseDate(LocalDateTime.now());
        newUserTicket.setStatus(UserTicketStatus.ACTIVE);

        if(ticketToPurchase.getType() == TicketType.PERIOD){
            newUserTicket.setExpiryDate(LocalDateTime.now().plusDays(ticketToPurchase.getDurationDays()));
        } else{
            newUserTicket.setExpiryDate(LocalDateTime.now().plusDays(ticketToPurchase.getDurationDays()));
            newUserTicket.setRemainingTime(ticketToPurchase.getDurationHours()* 60);
        }

        userTicketRepository.save(newUserTicket);
    }

    @Transactional(readOnly = true)
    public List<UserTicketDto> getMyTickets(String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));

        List<UserTicket> userTickets = userTicketRepository.findByUser(user);

        return userTickets.stream()
                .map(UserTicketDto::new)
                .collect(Collectors.toList());
    }

}
