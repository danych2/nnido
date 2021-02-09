@ECHO OFF
start "npm" /d %~dp0 npm run dev
start "django" /d %~dp0nnido manage.py runserver