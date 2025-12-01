<?php
$host = getenv("DB_HOST");
$port = getenv("DB_PORT");
$user = getenv("DB_USER");
$pass = getenv("DB_PASS");
$dbname = getenv("DB_NAME");

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die("Error conectando a la BD: " . $conn->connect_error);
}

echo "Conectado correctamente a Railway MySQL!";


?>
