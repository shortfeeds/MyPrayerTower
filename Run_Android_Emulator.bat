@echo off
title MyPrayerTower - Android Emulator Runner
color 0E
echo ========================================================
echo   Launching MyPrayerTower on Android Emulator
echo ========================================================
echo.

set JAVA_HOME=C:\Users\admin\dev\jdk-17\jdk-17.0.14+7
set PATH=%JAVA_HOME%\bin;C:\Users\admin\dev\flutter\bin;C:\Users\admin\AppData\Local\Android\Sdk\platform-tools;%PATH%

echo [1/3] Starting Android Phone Window on your desktop screen...
start "" "C:\Users\admin\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd medium_phone

echo.
echo [2/3] Waiting 15 seconds for Android OS to boot...
timeout /t 15

echo.
echo [3/3] Deploying and running MyPrayerTower v1.1.0 (Build 38)...
cd /d "%~dp0apps\flutter_app"
call C:\Users\admin\dev\flutter\bin\flutter.bat run -d android

pause
