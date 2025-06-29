@echo off
echo YouTube Ses Indirici uygulamasi baslatiliyor...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo HATA: Node.js yuklu degil. Lutfen Node.js'i yukleyip tekrar deneyin.
    echo Node.js indirmek icin: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Bagimlilikar yukleniyor...
    npm install
    if %errorlevel% neq 0 (
        echo HATA: Bagimlilikar yuklenemedi.
        pause
        exit /b 1
    )
)

echo Uygulama baslatiliyor...
echo.
echo Uygulama hazir oldugunda otomatik olarak tarayici acilacak.
echo Uygulamayi kapatmak icin bu pencereyi kapatabilirsiniz.
echo.

REM Wait a bit and then open browser
timeout /t 5 /nobreak >nul
start http://localhost:3000

REM Start the Next.js development server
npm run dev

REM If we get here, the server stopped
echo.
echo Uygulama kapandi.
pause
