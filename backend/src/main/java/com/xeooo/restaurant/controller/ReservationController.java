package com.xeooo.restaurant.controller;

import com.xeooo.restaurant.model.Reservation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/reservations")
@Tag(name = "Reservations", description = "Quản lý đặt bàn trực tuyến và tại chỗ cho nhà hàng Xéooo")
public class ReservationController {

    @GetMapping
    @Operation(summary = "Lấy danh sách đặt bàn theo ngày", description = "Cho phép lọc theo ngày và trạng thái phục vụ")
    public ResponseEntity<List<Reservation>> getReservations(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer floor) {
        // Returns list of reservations
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping
    @Operation(summary = "Tạo đặt bàn mới trực tuyến kèm mã VietQR", description = "Kiểm tra tính khả dụng của bàn và tính toán tiền cọc")
    public ResponseEntity<Reservation> createReservation(@Valid @RequestBody Reservation reservation) {
        if (reservation.getId() == null) {
            reservation.setId("MB-" + (int)(1000 + Math.random() * 9000));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đặt bàn", description = "Chuyển trạng thái: confirmed, seated, completed, cancelled")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {
        Map<String, Object> response = new HashMap<>();
        response.put("reservationId", id);
        response.put("status", status);
        response.put("updatedAt", new Date());
        return ResponseEntity.ok(response);
    }
}
