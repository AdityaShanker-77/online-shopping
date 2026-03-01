@echo off
echo ============================================
echo  Starting Shopp-E Microservices
echo ============================================

set JAVA_HOME=C:\Progra~1\OpenLogic\jdk-21.0.10.7-hotspot
set PATH=%JAVA_HOME%\bin;C:\maven\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin;%PATH%

echo [1/7] Starting Eureka Server (port 8761)...
start "Eureka Server" cmd /k "cd /d %~dp0eureka-server && mvn spring-boot:run"

echo Waiting 20 seconds for Eureka to start...
timeout /t 20 /nobreak

echo [2/7] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd /d %~dp0api-gateway && mvn spring-boot:run"

echo [3/7] Starting Auth Service (port 8081)...
start "Auth Service" cmd /k "cd /d %~dp0auth-service && mvn spring-boot:run"

echo [4/7] Starting Product Service (port 8082)...
start "Product Service" cmd /k "cd /d %~dp0product-service && mvn spring-boot:run"

echo [5/7] Starting Order Service (port 8083)...
start "Order Service" cmd /k "cd /d %~dp0order-service && mvn spring-boot:run"

echo [6/7] Starting User Service (port 8084)...
start "User Service" cmd /k "cd /d %~dp0user-service && mvn spring-boot:run"

echo [7/7] Starting Retailer Service (port 8085)...
start "Retailer Service" cmd /k "cd /d %~dp0retailer-service && mvn spring-boot:run"

echo.
echo ============================================
echo  All services launching in separate windows
echo  Eureka Dashboard: http://localhost:8761
echo ============================================
pause
