# syntax=docker/dockerfile:1

FROM nginx:latest

WORKDIR /app

COPY ./ /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]