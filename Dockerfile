FROM php:8.2-apache
FROM php:8.2-apache

# Activar extensiones necesarias para MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copiar todos los archivos del proyecto al servidor Apache
COPY . /var/www/html/

# Dar permisos
RUN chown -R www-data:www-data /var/www/html
