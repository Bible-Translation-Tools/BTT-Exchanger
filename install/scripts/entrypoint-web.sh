#!/bin/bash

# README.md used as a canary to see if files have been copied into the running volume
# copy files into the volume if they haven't been (this should only be on first run of the container)
#if [ ! -f /var/www/html/tE-backend/README.md ];
#  then cp -r --copy-contents /te-temp /var/www/html/tE-backend;
#fi

/scripts/wait-for-it.sh -h db -p 5432 -- python manage.py makemigrations api && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn -c /config/config.py tRecorderApi.wsgi
