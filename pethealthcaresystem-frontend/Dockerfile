# Dockerfile for React frontend

# Sử dụng node:alpine làm base image
FROM node:17-alpine3.15
#Copy [host machine] [container] (first paths is relative to the Dockerfile, second is relative to root on the container)
COPY package.json package-lock.json .

RUN npm install

COPY . .

RUN npm run build
