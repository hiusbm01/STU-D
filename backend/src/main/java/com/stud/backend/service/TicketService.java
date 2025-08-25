package com.stud.backend.service;

import com.stud.backend.domain.*;
import com.stud.backend.dto.TicketDto;
import com.stud.backend.dto.UserTicketDto;
import com.stud.backend.repository.TicketRepository;
import com.stud.backend.repository.UserRepository;
import com.stud.backend.repository.UserTicketRepository;
import lombok.RequiredArgsConstructor;
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

        Optional<UserTicket> existingActiveTicket = userTicketRepository.findByUserAndStatus(user, UserTicketStatus.ACTIVE)
                .stream()
                .findFirst();


        //ACTIVE 이용권이 이미 있는지 확인.
        if(existingActiveTicket.isPresent()){
            UserTicket activeTicket = existingActiveTicket.get();

            //기간권 사용중이면 다른 이용권 구매 불가.
            if(activeTicket.getTicket().getType() == TicketType.PERIOD){
                throw new IllegalStateException("이미 기간권을 사용중입니다.");
            }

            if(ticketToPurchase.getType() == TicketType.FIXED || ticketToPurchase.getType() == TicketType.HOURLY){
                int newRemainingTime = activeTicket.getRemainingTime() + (ticketToPurchase.getDurationHours() * 60);
                activeTicket.setRemainingTime(newRemainingTime);
            }
            LocalDateTime newExpiryDate = LocalDateTime.now().plusDays(ticketToPurchase.getDurationDays());
            if(activeTicket.getExpiryDate().isBefore(newExpiryDate)){
                activeTicket.setExpiryDate(newExpiryDate);
            }
        }else {
            UserTicket userTicket = new UserTicket();
            userTicket.setUser(user);
            userTicket.setTicket(ticketToPurchase);
            userTicket.setPurchaseDate(LocalDateTime.now());
            userTicket.setStatus(UserTicketStatus.ACTIVE);

            if (ticketToPurchase.getType() == TicketType.PERIOD) {
                userTicket.setExpiryDate(LocalDateTime.now().plusDays(ticketToPurchase.getDurationDays()));
            } else {
                userTicket.setExpiryDate(LocalDateTime.now().plusDays(ticketToPurchase.getDurationDays()));
                userTicket.setRemainingTime(ticketToPurchase.getDurationHours() * 60);
            }

            userTicketRepository.save(userTicket);
        }
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
