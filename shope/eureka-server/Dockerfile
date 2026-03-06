# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
# Copy the entire parent project to resolve module dependencies
COPY . .
# Build just the Eureka Server module and its dependencies
RUN mvn clean package -pl eureka-server -am -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
# Extract the built JAR
COPY --from=build /app/eureka-server/target/*.jar app.jar
# Expose the standard Eureka port
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
