@echo off
echo ============================================================
echo   Installing Redis for Windows (Memurai)
echo ============================================================
echo.
echo Memurai is a Redis-compatible server for Windows.
echo.
echo Option 1: Download and Install
echo ------------------------------
echo 1. Go to: https://www.memurai.com/get-memurai
echo 2. Download Memurai (free version)
echo 3. Install it
echo 4. Memurai will run on port 6379 automatically
echo.
echo Option 2: Portable Redis
echo ------------------------
echo 1. Download: https://github.com/tporadowski/redis/releases
echo 2. Extract ZIP file
echo 3. Run redis-server.exe
echo.
pause
echo.
echo Checking if Redis/Memurai is running...
echo.
powershell -Command "try { $client = New-Object System.Net.Sockets.TcpClient; $client.Connect('localhost', 6379); $client.Close(); Write-Host '✓ Redis is running on port 6379!' -ForegroundColor Green } catch { Write-Host '✗ Redis is NOT running on port 6379' -ForegroundColor Red; Write-Host '' -ForegroundColor White; Write-Host 'Please install and start Redis/Memurai first.' -ForegroundColor Yellow }"
echo.
pause

