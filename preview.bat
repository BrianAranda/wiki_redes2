@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\npx.cmd" quartz build --serve --port 8080
