#!/bin/bash

/scripts/wait-for-it.sh -h web -p 8000 -- celery -A tRecorderApi worker -l error -Ofair -c1