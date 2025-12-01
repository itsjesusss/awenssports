FROM php:8.2-apache

# Habilitar extensiones necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Copiar todos los archivos del proyecto
COPY . /var/www/html/

# Permisos correctos
RUN chmod -R 755 /var/www/html
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
