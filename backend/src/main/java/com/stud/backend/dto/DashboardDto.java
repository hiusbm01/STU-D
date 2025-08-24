package com.stud.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardDto {

    private long totalSeats;
    private long occupiedSeats;
    private long availableSeats;

}
