package com.curtain_call.server_core.domain.seat.entity;

import com.curtain_call.server_core.domain.performance.entity.Performance;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "seats", uniqueConstraints = {
        @UniqueConstraint(name = "uk_seat_performance_row_col", columnNames = {"performance_id", "row_num", "col_num"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performance_id", nullable = false)
    private Performance performance;

    @Column(name = "row_num", nullable = false)
    private String rowNum;

    @Column(name = "col_num", nullable = false)
    private Integer colNum;

    @Column(nullable = false)
    private String label;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatStatus status;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Seat(Performance performance, String rowNum, Integer colNum, String label, SeatStatus status) {
        this.performance = performance;
        this.rowNum = rowNum;
        this.colNum = colNum;
        this.label = label;
        this.status = status;
    }

    public void updateStatus(SeatStatus status) {
        this.status = status;
    }
}
