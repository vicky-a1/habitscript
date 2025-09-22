@echo off
echo ========================================
echo Building habitscript for Production
echo ========================================

echo.
echo 1. Installing dependencies...
call npm install

echo.
echo 2. Running TypeScript check...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo TypeScript check failed!
    pause
    exit /b 1
)

echo.
echo 3. Building for production...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo 4. Testing AI Mentor functionality...
call node test-ai-mentor-full.js
if %errorlevel% neq 0 (
    echo AI Mentor test failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo The application is ready for deployment.
echo Built files are in the 'dist' directory.
echo.
echo To preview the production build:
echo   npm run preview
echo.
echo To deploy to a static hosting service:
echo   1. Upload the 'dist' folder contents
echo   2. Configure your hosting for SPA routing
echo.
pause
