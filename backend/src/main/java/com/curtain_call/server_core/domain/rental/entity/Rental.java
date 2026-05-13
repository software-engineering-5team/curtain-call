package com.curtain_call.server_core.domain.rental.entity;

import com.curtain_call.server_core.domain.auth.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "rentals")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Rental {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User applicant;

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String studentId;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String clubName;

    @Column(nullable = false)
    private String activityName;

    @Column(nullable = false)
    private String eventName;

    @Column(columnDefinition = "TEXT")
    private String eventDescription;

    @Column(nullable = false)
    private LocalDate useDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RentalStatus status;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Rental(User applicant, String applicantName, String studentId, String phone, String clubName, String activityName, String eventName, String eventDescription, LocalDate useDate, LocalTime startTime, LocalTime endTime, Integer expectedAttendees, RentalStatus status) {
        this.applicant = applicant;
        this.applicantName = applicantName;
        this.studentId = studentId;
        this.phone = phone;
        this.clubName = clubName;
        this.activityName = activityName;
        this.eventName = eventName;
        this.eventDescription = eventDescription;
        this.useDate = useDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.expectedAttendees = expectedAttendees;
        this.status = status;
    }

    public void cancel() {
        this.status = RentalStatus.CANCELLED;
    }
}
