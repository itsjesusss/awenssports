<?php
include 'Conexion.php';

header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos JSON inválidos');
    }

    $required = ['gama', 'tipo', 'tallas', 'cantidad', 'datosCliente', 'datosEquipo', 'ideaUniforme', 'total', 'codigoSeguimiento'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Campo faltante: $field");
        }
    }

    $db = new Conexion();
    $conexion = $db->conexion;

    $datosCliente = $input['datosCliente'];
    $datosEquipo = $input['datosEquipo'];
    $codigo_seguimiento = $input['codigoSeguimiento'];
    $tallas_json = json_encode($input['tallas']);

    // Encontrar primera talla con cantidad > 0
    $talla_principal = 'M';
    foreach ($input['tallas'] as $talla => $cantidad) {
        if ($cantidad > 0) {
            $talla_principal = $talla;
            break;
        }
    }

    $sql = "INSERT INTO pedidos (codigo_seguimiento, gama, tipo, talla, cantidad, nombre_cliente, telefono_cliente, email_cliente, direccion_cliente, nombre_equipo, categoria_equipo, colores_equipo, idea_uniforme, total, tallas_json) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conexion->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conexion->error);
    }

    $stmt->bind_param(
        "ssssissssssssds",
        $codigo_seguimiento,
        $input['gama'],
        $input['tipo'],
        $talla_principal,
        $input['cantidad'],
        $datosCliente['nombre'],
        $datosCliente['telefono'],
        $datosCliente['email'],
        $datosCliente['direccion'],
        $datosEquipo['nombre'],
        $datosEquipo['categoria'],
        $datosEquipo['colores'],
        $input['ideaUniforme'],
        $input['total'],
        $tallas_json
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'codigo_seguimiento' => $codigo_seguimiento]);
    } else {
        throw new Exception("Error ejecutando consulta: " . $stmt->error);
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
