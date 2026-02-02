@echo off
echo ========================================
echo MongoDB Starter - Debug Mode
echo ========================================
echo.

cd /d "C:\Program Files\MongoDB\Server\8.2\bin"

if not exist "C:\data\db" (
    echo Creating data directory C:\data\db...
    mkdir "C:\data\db" 2>nul
    if errorlevel 1 (
        echo ERROR: Could not create data directory!
        echo Please run this script as Administrator.
        pause
        exit /b 1
    )
    echo Data directory created successfully.
    echo.
)

echo Starting MongoDB...
echo MongoDB will show output here. Look for any errors.
echo Press Ctrl+C to stop MongoDB.
echo.
echo ========================================
echo.

mongod --dbpath "C:\data\db"

echo.
echo ========================================
echo MongoDB stopped.
pause
