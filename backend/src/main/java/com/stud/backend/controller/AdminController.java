package com.stud.backend.controller;

import com.stud.backend.domain.Ticket;
import com.stud.backend.domain.User;
import com.stud.backend.dto.UserTicketDto;
import com.stud.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<UserTicketDto>> getAllUserTickets(){
        List<UserTicketDto> userTickets = adminService.getAllUserTickets();
        return ResponseEntity.ok(userTickets);
    }
}
