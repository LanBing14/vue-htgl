#base image
FROM nginx

#maintainer info
MAINTAINER suncen "suncen@citgc.com"

COPY dist /usr/local/fxb-web
COPY nginx.conf /etc/nginx/nginx.conf
