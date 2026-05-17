FROM gradle:8.7-jdk21-alpine AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src src
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
COPY --from=builder /app/build/libs/*SNAPSHOT.jar app.jar
EXPOSE 8080
ENV TZ=Asia/Seoul
ENTRYPOINT ["java", "-jar", "app.jar"]
