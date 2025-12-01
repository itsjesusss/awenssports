<?php
$host = getenv("interchange.proxy.rlwy.net");
$port = getenv("35142");
$user = getenv("root");
$pass = getenv("GwTGgeEKpDwjbqoVQJDPXjyfcwRWCaum");
$dbname = getenv("railway");

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die("Error conectando a la BD: " . $conn->connect_error);
}

echo "Conectado correctamente a Railway MySQL!";


?>

