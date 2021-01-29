FROM python:3.6-slim-stretch as dependency
RUN echo "deb http://deb.debian.org/debian stretch main non-free\n" >> /etc/apt/sources.list && \
    echo "deb-src http://deb.debian.org/debian stretch main non-free\n" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*
COPY ./te-backend/requirements.txt /var/www/html/tE-backend/requirements.txt
RUN pip install -r /var/www/html/tE-backend/requirements.txt
COPY ./te-backend/scripts/download_chunks.py /var/www/html/tE-backend/scripts/download_chunks.py
WORKDIR /var/www/html/tE-backend/scripts
RUN python3 ./download_chunks.py
FROM node:8-stretch-slim as builder
COPY ./te-backend/tRecorderApi/frontend /te-backend/tRecorderApi/frontend
WORKDIR /te-backend/tRecorderApi/frontend
RUN npm link cross-env && npm install --production && npm run build
FROM dependency
COPY ./te-backend/ /var/www/html/tE-backend
COPY --from=builder /te-backend/tRecorderApi/frontend /var/www/html/tE-backend/tRecorderApi/frontend
COPY --from=dependency /var/www/html/tE-backend/scripts/chunks/ /var/www/html/tE-backend/tRecorderApi/static/
VOLUME [ "/var/www/html/tE-backend/tRecorderApi/media" ]
WORKDIR /var/www/html/tE-backend/tRecorderApi