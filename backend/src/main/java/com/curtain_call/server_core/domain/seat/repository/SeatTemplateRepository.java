package com.curtain_call.server_core.domain.seat.repository;

import com.curtain_call.server_core.domain.seat.entity.SeatTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatTemplateRepository extends JpaRepository<SeatTemplate, Long> {
}
