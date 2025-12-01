<?php
require_once 'conexion.php';

try {
    $db = new Conexion();
    $conn = $db->conexion;

    $sql = "
    CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo_seguimiento VARCHAR(50) NOT NULL,
        gama VARCHAR(50) NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        talla VARCHAR(10) NOT NULL,
        cantidad INT NOT NULL,
        
        nombre_cliente VARCHAR(100) NOT NULL,
        telefono_cliente VARCHAR(20) NOT NULL,
        email_cliente VARCHAR(100) NOT NULL,
        direccion_cliente VARCHAR(255) NOT NULL,
        
        nombre_equipo VARCHAR(100) NOT NULL,
        categoria_equipo VARCHAR(100) NOT NULL,
        colores_equipo VARCHAR(100) NOT NULL,
        
        idea_uniforme TEXT NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        
        tallas_json TEXT,
        
        estado VARCHAR(20) NOT NULL DEFAULT 'revision',
        
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ";

    if ($conn->query($sql) === TRUE) {
        echo "Tabla 'pedidos' creada correctamente.";
    } else {
        echo "Error creando tabla: " . $conn->error;
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
