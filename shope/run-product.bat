@echo off
set JAVA_HOME=C:\Progra~1\OpenLogic\jdk-21.0.10.7-hotspot
set PATH=%JAVA_HOME%\bin;C:\maven\apache-maven-3.9.12-bin\apache-maven-3.9.12\bin;%PATH%

echo Step 1: Compiling product-service...
cd /d %~dp0product-service
mvn compile -q
if %errorlevel% neq 0 (
    echo COMPILATION FAILED!
    pause
    exit /b 1
)
echo COMPILATION SUCCESSFUL!

echo Step 2: Starting product-service...
mvn spring-boot:run
