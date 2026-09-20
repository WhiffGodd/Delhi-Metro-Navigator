FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN java scripts/Build.java --test

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/delhi-metro.jar app.jar
USER 10001:10001
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
