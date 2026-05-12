package com.curtain_call.server_core.domain.rental.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@NoArgsConstructor
public class RentalCreateRequest {
    @NotBlank
    private String applicantName;
    @NotBlank
    private String studentId;
    @NotBlank
    private String phone;
    @NotBlank
    private String clubName;
    @NotBlank
    private String activityName;
    @NotBlank
    private String eventName;
    private String eventDescription;
    @NotNull
    private LocalDate useDate;
    @NotNull
    private LocalTime startTime;
    @NotNull
    private LocalTime endTime;
    @NotNull
    private Integer expectedAttendees;
}
