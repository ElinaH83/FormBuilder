FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /usr/src/app

COPY ./mvn* /usr/src/app
COPY ./.mvn* /usr/src/app
COPY ./pom.xml /usr/src/app
RUN mvn dependency:go-offline

COPY . /usr/src/app
RUN mvn package

FROM openjdk:17

COPY --from=builder /usr/src/app/target/*.jar /app.jar

EXPOSE 8080

ENTRYPOINT ["java"]
CMD ["-jar", "/app.jar"]
# CMD ["mvn", "spring-boot:run"]
