@echo off
set "JAVA_HOME=C:\Program Files\OpenLogic\jdk-21.0.10.7-hotspot"
cd /d "%~dp0api-gateway"
mvn spring-boot:run
