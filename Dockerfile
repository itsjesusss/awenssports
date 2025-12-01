FROM php:8.2-apache

# Habilitar módulos necesarios
RUN a2enmod rewrite
RUN a2enmod headers

# Instalar extensiones MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copiar el proyecto a /var/www/html
COPY . /var/www/html/

# Dar permisos a Apache
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Configurar Apache para permitir .htaccess
RUN echo "<Directory /var/www/html/> \
    AllowOverride All \
    Require all granted \
</Directory>" > /etc/apache2/conf-available/project.conf

RUN a2enconf project

# Habilitar index.php primero
RUN sed -i 's/DirectoryIndex .*/DirectoryIndex index.php index.html/' /etc/apache2/mods-enabled/dir.conf
