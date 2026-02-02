# MongoDB Starter and Tester Script
# Run: powershell -ExecutionPolicy Bypass -File start-and-test-mongodb.ps1

Write-Host "`n🔍 Checking MongoDB Status...`n" -ForegroundColor Cyan

$mongoPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
$dataDir = "C:\data\db"

# Check if MongoDB executable exists
if (-not (Test-Path $mongoPath)) {
    Write-Host "❌ MongoDB not found at: $mongoPath" -ForegroundColor Red
    Write-Host "   Please check your MongoDB installation.`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ MongoDB found at: $mongoPath" -ForegroundColor Green

# Check if MongoDB is already running
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
$portTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue

if ($mongoProcess -or $portTest) {
    Write-Host "✅ MongoDB is already running!`n" -ForegroundColor Green
    Write-Host "🧪 Testing connection..." -ForegroundColor Cyan
    node test-db-connection.js
    exit 0
}

# Create data directory if it doesn't exist
if (-not (Test-Path $dataDir)) {
    Write-Host "📁 Creating data directory: $dataDir" -ForegroundColor Yellow
    try {
        New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
        Write-Host "✅ Data directory created`n" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create data directory: $_" -ForegroundColor Red
        Write-Host "   Try running PowerShell as Administrator`n" -ForegroundColor Yellow
        exit 1
    }
}

# Try to start MongoDB service first
Write-Host "🚀 Attempting to start MongoDB service...`n" -ForegroundColor Cyan
$serviceStarted = $false

$service = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($service) {
    if ($service.Status -eq 'Stopped') {
        try {
            Start-Service MongoDB -ErrorAction Stop
            Start-Sleep -Seconds 3
            $service.Refresh()
            if ($service.Status -eq 'Running') {
                Write-Host "✅ MongoDB service started successfully!`n" -ForegroundColor Green
                Write-Host "🧪 Testing connection..." -ForegroundColor Cyan
                Start-Sleep -Seconds 2
                node test-db-connection.js
                exit 0
            }
        } catch {
            Write-Host "⚠️  Could not start MongoDB service: $_" -ForegroundColor Yellow
        }
    } elseif ($service.Status -eq 'Running') {
        Write-Host "✅ MongoDB service is already running!`n" -ForegroundColor Green
        Write-Host "🧪 Testing connection..." -ForegroundColor Cyan
        node test-db-connection.js
        exit 0
    }
}

if (-not $serviceStarted) {
    Write-Host "   Trying to start MongoDB manually...`n" -ForegroundColor Yellow
}

# Start MongoDB manually
Write-Host "🚀 Starting MongoDB manually...`n" -ForegroundColor Cyan
Write-Host "   MongoDB will run in a new window." -ForegroundColor Yellow
Write-Host "   Keep that window open while developing.`n" -ForegroundColor Yellow

try {
    Start-Process -FilePath $mongoPath -ArgumentList "--dbpath", "`"$dataDir`"" -WindowStyle Normal
    Write-Host "✅ MongoDB process started!" -ForegroundColor Green
    Write-Host "   Waiting for MongoDB to initialize...`n" -ForegroundColor Yellow
    
    # Wait and test connection
    $maxAttempts = 10
    $attempt = 0
    $connected = $false
    
    while ($attempt -lt $maxAttempts) {
        Start-Sleep -Seconds 2
        $portTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($portTest) {
            $connected = $true
            break
        }
        $attempt++
        Write-Host "   Attempt $attempt/$maxAttempts - Waiting for MongoDB..." -ForegroundColor Gray
    }
    
    if ($connected) {
        Write-Host "`n✅ MongoDB is running and ready!`n" -ForegroundColor Green
        Write-Host "🧪 Testing connection...`n" -ForegroundColor Cyan
        node test-db-connection.js
    } else {
        Write-Host "`n⚠️  MongoDB started but connection test timed out." -ForegroundColor Yellow
        Write-Host "   MongoDB may still be initializing. Try running:" -ForegroundColor Yellow
        Write-Host "   npm run test-db`n" -ForegroundColor Cyan
    }
} catch {
    Write-Host "`n❌ Failed to start MongoDB: $_" -ForegroundColor Red
    Write-Host "`n💡 Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Run PowerShell as Administrator" -ForegroundColor White
    Write-Host "   2. Or manually start MongoDB:" -ForegroundColor White
    Write-Host "      Double-click: start-mongodb-admin.bat`n" -ForegroundColor Cyan
    exit 1
}
