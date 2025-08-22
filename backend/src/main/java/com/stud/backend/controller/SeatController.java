package com.stud.backend.controller;

import com.stud.backend.dto.CheckoutResponseDto;
import com.stud.backend.dto.SeatDto;
import com.stud.backend.dto.SeatUsageHistoryDto;
import com.stud.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<SeatDto>> getAllSeats(){
        List<SeatDto> seats = seatService.getAllSeats();
        return ResponseEntity.ok(seats);
    }

    @PostMapping("/{seatId}/reserve")
    public ResponseEntity<String> reserveSeat(
            @PathVariable Long seatId,
            @AuthenticationPrincipal UserDetails userDetails){

        seatService.reserveSeat(seatId, userDetails.getUsername());
        return ResponseEntity.ok("좌석 예약에 성공했습니다.");
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponseDto> checkout(@AuthenticationPrincipal UserDetails userDetails){
        CheckoutResponseDto responseDto = seatService.checkout(userDetails.getUsername());
        return ResponseEntity.ok(responseDto);
    }
    @GetMapping("/my")
    public ResponseEntity<?> getMyReservation(@AuthenticationPrincipal UserDetails userDetails){
        SeatDto myReservation = seatService.getMyReservation(userDetails.getUsername());

        if(myReservation == null){
            //예약정보가 없을경우 204 no content 반환
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(myReservation);
    }
    @GetMapping("/history")
    public ResponseEntity<List<SeatUsageHistoryDto>> getmySeatUsageHistory(@AuthenticationPrincipal UserDetails userDetails){
        List<SeatUsageHistoryDto> history = seatService.getMySeatUsageHistory(userDetails.getUsername());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/my-seat")
    public ResponseEntity<SeatDto> getMyActiveSeat(@AuthenticationPrincipal UserDetails userDetails){
        return seatService.getMyActiveSeat(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }


}
