# Quick Start Script for Windows PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Peer-to-Peer Learning Platform Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists in backend
if (-Not (Test-Path "backend\.env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    
    $envContent = @"
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/peer-learning
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=30d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
CLIENT_URL=http://localhost:3000
"@
    
    Set-Content -Path "backend\.env" -Value $envContent
    Write-Host "✓ Backend .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ Backend .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure MongoDB is running" -ForegroundColor White
Write-Host "2. Open a terminal and run: cd backend && npm run dev" -ForegroundColor White
Write-Host "3. Open another terminal and run: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed setup instructions, see SETUP.md" -ForegroundColor White
Write-Host ""
