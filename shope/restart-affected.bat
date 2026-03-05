@echo off
set JAVA_HOME=C:\Progra~1\OpenLogic\jdk-21.0.10.7-hotspot
set PATH=%JAVA_HOME%\bin;C:\maven\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin;%PATH%

echo Restarting Product Service and API Gateway...

echo [1/2] Starting API Gateway (port 8080)...
start "API Gateway" cmd /k "cd /d %~dp0api-gateway && mvn spring-boot:run"

echo [2/2] Starting Product Service (port 8082)...
start "Product Service" cmd /k "cd /d %~dp0product-service && mvn spring-boot:run"

echo Both services are starting in separate windows.
pause
