#!/bin/bash
cd /home/toshkanov/Downloads/kitobxonbek-main/backend
nohup venv/bin/python manage.py runserver 0.0.0.0:8000 > /tmp/backend.log 2>&1 &
echo "Backend PID: $!"
