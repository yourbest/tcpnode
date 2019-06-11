@echo on
title START InfluxDB and Grafana
REM color 17
REM mode con cols=120 lines=40
pause
start /d "%cd%\grafana-6.1.3\bin" /b grafana-server.exe
start /d "%cd%\influxdb-1.7.0~n201901110800-0" /b influxd.exe
start /d "D:\DEV\workspace-node\tcpnode" /b node server.js