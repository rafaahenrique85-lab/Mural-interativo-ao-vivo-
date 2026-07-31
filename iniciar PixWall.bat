@echo off
title PixWall Server

cd /d "%~dp0"

start cmd /k "node server/server.js"

timeout /t 3 /nobreak >nul

start http://localhost:3000/mural.html
start http://localhost:3000/admin.html