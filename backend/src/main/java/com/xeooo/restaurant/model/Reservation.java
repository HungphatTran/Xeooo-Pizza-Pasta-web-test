package com.xeooo.restaurant.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @Column(name = "ReservationId", length = 50)
    private String id;

    @NotBlank
    @Column(name = "CustomerName", nullable = false, length = 150)
    private String customerName;

    @NotBlank
    @Column(name = "Phone", nullable = false, length = 30)
    private String phone;

    @Column(name = "Email", length = 150)
    private String email;

    @NotNull
    @Column(name = "ReservationDate", nullable = false)
    private LocalDate reservationDate;

    @NotBlank
    @Column(name = "TimeSlot", nullable = false, length = 20)
    private String timeSlot;

    @NotNull
    @Column(name = "Pax", nullable = false)
    private Integer pax;

    @NotNull
    @Column(name = "FloorNumber", nullable = false)
    private Integer floorNumber;

    @NotBlank
    @Column(name = "TableId", nullable = false, length = 50)
    private String tableId;

    @NotBlank
    @Column(name = "TableName", nullable = false, length = 100)
    private String tableName;

    @Column(name = "DecorationSet", length = 50)
    @Builder.Default
    private String decorationSet = "none";

    @Column(name = "Occasion", length = 50)
    @Builder.Default
    private String occasion = "normal";

    @Column(name = "SpecialEventTitle", length = 200)
    private String specialEventTitle;

    @Column(name = "HasBlackboard")
    @Builder.Default
    private Boolean hasBlackboard = false;

    @Column(name = "DepositAmount", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal depositAmount = BigDecimal.ZERO;

    @Column(name = "TotalAmount", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "PaymentStatus", length = 30)
    @Builder.Default
    private String paymentStatus = "unpaid";

    @Column(name = "PaymentMethod", length = 50)
    private String paymentMethod;

    @Column(name = "Source", length = 30)
    @Builder.Default
    private String source = "online";

    @Column(name = "Status", length = 30)
    @Builder.Default
    private String status = "confirmed";

    @Column(name = "Note", columnDefinition = "NVARCHAR(MAX)")
    private String note;

    @Column(name = "CreatedAt", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
