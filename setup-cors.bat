@echo off
echo Setting up CORS for Firebase Storage...
echo.

REM Check if gcloud is installed
gcloud version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Google Cloud SDK is not installed!
    echo Please install it from: https://cloud.google.com/storage/docs/gsutil_install
    echo.
    pause
    exit /b 1
)

echo Google Cloud SDK found!
echo.

REM Authenticate with Google Cloud
echo Authenticating with Google Cloud...
gcloud auth login

REM Set the project
echo Setting project to classhub...
gcloud config set project classhub

REM Apply CORS configuration
echo Applying CORS configuration...
gsutil cors set cors.json gs://classhub.appspot.com

REM Verify CORS configuration
echo Verifying CORS configuration...
gsutil cors get gs://classhub.appspot.com

echo.
echo CORS setup completed!
echo You can now upload images from localhost:3000
echo.
pause
