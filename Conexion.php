<?php
class Conexion {
    public $conexion;

    public function __construct() {

        $host = getenv("DB_HOST");
        $port = getenv("DB_PORT");
        $user = getenv("DB_USER");
        $pass = getenv("DB_PASS");
        $dbname = getenv("DB_NAME");

        $this->conexion = new mysqli($host, $user, $pass, $dbname, $port);

        if ($this->conexion->connect_error) {
            die("Error de conexión: " . $this->conexion->connect_error);
        }

        $this->conexion->set_charset("utf8mb4");
    }
}
