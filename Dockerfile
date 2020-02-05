FROM nginx
MAINTAINER jleopard@126.com
ENV TIMEZONE Asia/Shanghai
ENV LANG en_US.UTF-8
VOLUME /tmp
ADD ./dist/ /usr/share/nginx/html/
EXPOSE 80
EXPOSE 443
