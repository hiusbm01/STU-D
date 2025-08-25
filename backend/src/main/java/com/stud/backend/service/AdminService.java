package com.stud.backend.service;


import com.stud.backend.domain.User;
import com.stud.backend.dto.UserTicketDto;
import com.stud.backend.repository.UserRepository;
import com.stud.backend.repository.UserTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final UserTicketRepository userTicketRepository;

    @Transactional(readOnly = true)
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @Transactional(readOnly =true)
    public List<UserTicketDto> getAllUserTickets(){
        return userTicketRepository.findAll().stream()
                .map(UserTicketDto::new)
                .collect(Collectors.toList());
    }
}
