FROM php:8.2-apache

# Instalar extensiones necesarias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitar módulos
RUN a2enmod rewrite
RUN a2enmod headers

# Copiar tu proyecto al servidor
COPY . /var/www/html/

# Establecer permisos correctos
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Habilitar archivo .htaccess
RUN sed -i "s/AllowOverride None/AllowOverride All/g" /etc/apache2/apache2.conf

EXPOSE 80

