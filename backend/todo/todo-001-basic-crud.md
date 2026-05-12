# [TODO-001] 백엔드 기본 CRUD API 및 DDD 구조 설정

## 목표
- 제공된 API 명세서(Google Sheets)를 기반으로 핵심 도메인들의 기본 CRUD API를 구성한다.
- 도메인 주도 설계(DDD: Domain-Driven Design) 방식으로 프로젝트 폴더 구조를 분리하여 응집도를 높인다.

## 관련 파일
- `backend/src/main/java/com/curtain_call/server_core/domain/*`

## 도메인별 폴더 구조 (DDD 기반)
각 도메인 패키지 내부에 `controller`, `service`, `repository`, `entity`, `dto` 등의 계층형 구조를 가집니다.

```text
domain/
  ├── auth/            (인증/회원 도메인)
  ├── rental/          (공연장 대여 도메인)
  ├── performance/     (공연 정보 도메인)
  ├── seat/            (좌석 템플릿 및 배치 도메인)
  └── booking/         (좌석 선점 및 예매 도메인)
```

---

## 할 일 목록

### 1. Auth (인증/회원)
- [x] `domain/auth/entity/User.java` 엔티티 생성 (id, name, email, studentId)
- [x] `domain/auth/repository/UserRepository.java` 생성
- [x] `domain/auth/controller/AuthController.java` 및 DTO 생성
- [ ] `POST /api/auth/google/login`: 구글 로그인 로직 구현 (@kookmin.ac.kr 도메인 검증)
- [ ] `POST /api/auth/logout`: 로그아웃 처리
- [ ] `GET /api/auth/me`: 내 정보 조회

### 2. Rental (대여)
- [x] `domain/rental/entity/Rental.java` 엔티티 생성
- [x] `domain/rental/controller/RentalController.java` 및 DTO 생성 (Repository, Service 대기중)
- [ ] `POST /api/rentals`: 공연장 대여 신청 (시간 중복 검증 및 즉시 확정)
- [ ] `GET /api/rentals/check`: 시간 충돌 사전 확인
- [ ] `GET /api/rentals`: 대여 일정 전체 조회 (캘린더 표시용)
- [ ] `GET /api/rentals/{rentalId}`: 대여 상세 조회
- [ ] `GET /api/rentals/me`: 내 대여 신청 내역 조회
- [ ] `PATCH /api/rentals/{rentalId}/cancel`: 대여 소프트 취소 (본인 소유 검증)

### 3. Performance (공연)
- [x] `domain/performance/entity/Performance.java` 엔티티 생성
- [x] `domain/performance/controller/PerformanceController.java` 및 DTO 생성
- [ ] `POST /api/performances`: 공연 정보 등록 (확정된 대여 내역 검증)
- [ ] `POST /api/performances/upload-poster`: 포스터 이미지 업로드 로직 구성
- [ ] `PUT /api/performances/{performanceId}`: 공연 정보 수정
- [ ] `GET /api/performances`: 공연 목록 전체 조회 (페이징 적용)
- [ ] `GET /api/performances/{performanceId}`: 공연 상세 조회 (잔여 좌석 수 포함)
- [ ] `GET /api/performances/me`: 내 공연(주최) 목록 조회

### 4. Seat (좌석)
- [x] `domain/seat/entity/SeatTemplate.java`, `Seat.java` 엔티티 생성
- [x] `domain/seat/controller/SeatController.java` 및 DTO 생성
- [ ] `GET /api/seat-templates`: 좌석 기본 템플릿 목록 조회
- [ ] `POST /api/performances/{performanceId}/seats`: 특정 공연의 좌석 배치 생성
- [ ] `PUT /api/performances/{performanceId}/seats`: 좌석 배치 수정 (예매 시작 전 검증)
- [ ] `GET /api/performances/{performanceId}/seats`: 실시간 좌석 상태 조회 (AVAILABLE / HELD / BOOKED)

### 5. Booking (예매 및 선점)
- [x] `domain/booking/entity/Booking.java`, `BookingSeat.java` 엔티티 생성
- [x] `domain/booking/controller/BookingController.java` 및 DTO 생성
- [ ] `POST /api/bookings/hold`: 좌석 임시 선점 (동시성 제어 적용 및 TTL 관리)
- [ ] `DELETE /api/bookings/hold/{holdToken}`: 임시 선점 해제
- [ ] `POST /api/bookings`: 예매 확정 (좌석 충돌 방지 트랜잭션, 1인당 한도 초과 검증)
- [ ] `DELETE /api/bookings/{bookingId}`: 예매 취소 (공연 시작 전 시간 검증)
- [ ] `GET /api/bookings/me`: 내 예매 내역 조회
- [ ] `GET /api/bookings/{bookingId}`: 예매 상세 조회
- [ ] `GET /api/performances/{performanceId}/bookings`: 공연별 예매 현황 (주최자 전용 조회 권한 검증)

---

## 완료 조건
- [ ] 명시된 5개의 도메인 패키지 구조가 정상적으로 분리되었는가
- [ ] 모든 API 엔드포인트(Controller)와 필수 Request/Response DTO가 정의되었는가
- [ ] JpaRepository 등을 활용해 DB 연동 기반이 구성되었는가
- [ ] (선택) PR 생성 및 머지 후 Status 완료 확인
