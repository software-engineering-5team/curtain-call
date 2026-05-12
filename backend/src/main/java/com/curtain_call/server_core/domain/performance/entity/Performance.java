package com.curtain_call.server_core.domain.performance.entity;

import com.curtain_call.server_core.domain.rental.entity.Rental;
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
@Table(name = "performances")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_id", nullable = false, unique = true)
    private Rental rental;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "poster_image_url")
    private String posterImageUrl;

    @Column(nullable = false)
    private LocalDateTime bookingStartDate;

    @Column(nullable = false)
    private LocalDateTime bookingEndDate;

    @Column(nullable = false)
    private Integer totalSeats;

    @Column(nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    private Integer maxSeatsPerPerson;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Performance(Rental rental, String title, String description, String posterImageUrl, LocalDateTime bookingStartDate, LocalDateTime bookingEndDate, Integer totalSeats, Integer availableSeats, Integer maxSeatsPerPerson) {
        this.rental = rental;
        this.title = title;
        this.description = description;
        this.posterImageUrl = posterImageUrl;
        this.bookingStartDate = bookingStartDate;
        this.bookingEndDate = bookingEndDate;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.maxSeatsPerPerson = maxSeatsPerPerson;
    }
}
