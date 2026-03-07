@echo off
echo Setting JAVA_HOME...
set JAVA_HOME=C:\Program Files\OpenLogic\jdk-21.0.10.7-hotspot\

echo Running JUnit tests for all modules...
mvn clean test

echo.
powershell -ExecutionPolicy Bypass -File "%~dp0print-coverage.ps1"
echo.
echo Tests completed! You can take your screenshot now.
pause
