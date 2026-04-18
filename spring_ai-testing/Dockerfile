# FROM  eclipse-temurin:17-jdk
#FROM maven:3.9.4-eclipse-temurin-17 AS build

#COPY target/spring_ai-testing-0.0.1-SNAPSHOT.jar  /usr/app/

#WORKDIR /usr/app/

#ENTRYPOINT [ "java", "-jar" , "spring_ai-testing-0.0.1-SNAPSHOT.jar" ]



# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
