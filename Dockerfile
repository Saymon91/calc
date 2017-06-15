# Base image

FROM debian:jessie

RUN echo 'deb http://packages.dotdeb.org jessie all' >> /etc/apt/sources.list
RUN echo 'deb-src http://packages.dotdeb.org jessie all' >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y wget git zip unzip

RUN cd /tmp
RUN git clone https://github.com/kasparsd/php-7-debian.git
RUN cd php-7-debian/
CMD ["./build.sh"]

RUN cd /tmp
RUN wget https://www.dotdeb.org/dotdeb.gpg
RUN apt-key add dotdeb.gpg
RUN rm dotdeb.gpg

RUN apt-get update

RUN apt-get install -y php7.0 php7.0-fpm php7.0-common php7.0-mysql php7.0-xml php7.0-zip

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

#RUN apt-get install -y nginx && apt-get autoremove && apt-get clean

#CMD ["rm", "-f", "/etc/nginx/sites-available/default"]
#COPY ./default /etc/nginx/sites-available/default
#RUN service nginx stop
#RUN service nginx start

RUN cd /
WORKDIR /src

RUN touch ./.env

COPY ./app ./app
COPY ./bin ./bin
COPY ./src ./src
COPY ./vendor ./vendor
COPY ./web ./web
COPY ./composer.json ./composer.json
COPY ./composer.lock ./composer.lock

#RUN composer install
#RUN composer update -d  ./

#RUN php app/console --env=prod cache:clear
#RUN php app/console --env=dev cache:clear

EXPOSE 8000

ENTRYPOINT ["php", "app/console", "--env=dev", "server:run"]



