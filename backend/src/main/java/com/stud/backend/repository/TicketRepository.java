package com.stud.backend.repository;

import com.stud.backend.domain.Ticket;
import com.stud.backend.domain.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Long> {

    List<Ticket> findByType(TicketType type);
}
