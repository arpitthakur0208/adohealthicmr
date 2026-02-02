@echo off
echo Starting MongoDB...
echo.
echo This will start MongoDB on localhost:27017
echo Press Ctrl+C to stop MongoDB when done.
echo.

cd /d "C:\Program Files\MongoDB\Server\8.2\bin"

if not exist "C:\data\db" (
    echo Creating data directory...
    mkdir "C:\data\db"
)

echo Starting mongod...
mongod --dbpath "C:\data\db"

pause
