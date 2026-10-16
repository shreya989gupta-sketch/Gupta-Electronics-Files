@echo off
title Gupta Electronics - Local Server
echo Starting Gupta Electronics Website...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
