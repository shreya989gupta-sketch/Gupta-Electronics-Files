$port = 8000
$url = "http://localhost:$port"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   Gupta Electronics - Local Server" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Starting server at $url..." -ForegroundColor Green
Write-Host "Opening in your default browser..." -ForegroundColor Green

Start-Process $url

Set-Location -Path $PSScriptRoot

if (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server $port
} elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    npx serve . -l $port
} else {
    Write-Host "Neither Python nor Node found. Please install Python or Node.js to run the local server." -ForegroundColor Red
}

