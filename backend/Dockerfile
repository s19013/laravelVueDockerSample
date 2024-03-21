FROM php:8.2.8-fpm-alpine3.18

WORKDIR /backend
COPY ./src/ /backend

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN docker-php-ext-install pdo_mysql

