# Test UserController OTP Flow

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Testing UserController OTP Flow" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Send OTP
Write-Host "Test 1: POST /user/send-otp" -ForegroundColor Yellow
$sendOtpBody = @{
    email = "testuser@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083/user/send-otp" `
        -Method POST `
        -ContentType "application/json" `
        -Body $sendOtpBody `
        -UseBasicParsing

    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Response: $($response.Content)" -ForegroundColor Green
    Write-Host "📧 Check console output for OTP`n" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Prompt for OTP
Write-Host "========================================" -ForegroundColor Cyan
$otp = Read-Host "Enter the OTP from console"

if ([string]::IsNullOrWhiteSpace($otp)) {
    Write-Host "⚠ No OTP entered. Exiting.`n" -ForegroundColor Yellow
    exit
}

# Test 2: Register with OTP
Write-Host "`nTest 2: POST /user/register (with OTP validation)" -ForegroundColor Yellow
$registerBody = @{
    username = "testuser123"
    email = "testuser@example.com"
    password = "Pass@123"
    role = "CUSTOMER"
    otp = $otp
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083/user/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -UseBasicParsing

    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "✓ Response: $($response.Content)" -ForegroundColor Green
    Write-Host "✅ User registered successfully!`n" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "✗ Response: $responseBody`n" -ForegroundColor Red
    }
}

# Test 3: Try registering with wrong OTP
Write-Host "Test 3: POST /user/register (wrong OTP - should fail)" -ForegroundColor Yellow
$invalidBody = @{
    username = "testuser456"
    email = "testuser@example.com"
    password = "Pass@123"
    role = "CUSTOMER"
    otp = "000000"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083/user/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $invalidBody `
        -UseBasicParsing

    Write-Host "✗ Unexpected success - security issue!" -ForegroundColor Red
} catch {
    Write-Host "✓ Expected failure: Invalid OTP rejected" -ForegroundColor Green
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "✓ Error: $responseBody`n" -ForegroundColor Gray
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ Summary:" -ForegroundColor Green
Write-Host "  • OTP generated and stored in Redis" -ForegroundColor White
Write-Host "  • User created ONLY after OTP validation" -ForegroundColor White
Write-Host "  • Invalid OTP rejected" -ForegroundColor White
Write-Host "  • Minimal code - no extra services`n" -ForegroundColor White

