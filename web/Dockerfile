FROM node:8-stretch-slim as builder
COPY ./te-backend/ /te-backend/
WORKDIR /te-backend/tRecorderApi/frontend
RUN npm link cross-env && npm install --production && npm run build

FROM python:3.6-slim-stretch 
RUN echo "deb http://deb.debian.org/debian stretch main non-free\n" >> /etc/apt/sources.list && \
    echo "deb-src http://deb.debian.org/debian stretch main non-free\n" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /te-backend /var/www/html/tE-backend
WORKDIR /var/www/html/tE-backend/scripts
RUN python3 ./download_chunks.py && \
    mv /var/www/html/tE-backend/scripts/chunks/ /var/www/html/tE-backend/tRecorderApi/static/ && \
    pip install -r /var/www/html/tE-backend/requirements.txt
VOLUME [ "/var/www/html/tE-backend/tRecorderApi/media" ]
WORKDIR /var/www/html/tE-backend/tRecorderApi
