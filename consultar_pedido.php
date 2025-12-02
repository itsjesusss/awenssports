<?php
include 'Conexion.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['codigo'])) {
        throw new Exception('Código no proporcionado');
    }

    $codigo = $_GET['codigo'];
    $db = new Conexion();
    $conexion = $db->conexion;

    $sql = "SELECT * FROM pedidos WHERE codigo_seguimiento = ?";
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conexion->error);
    }

    $stmt->bind_param("s", $codigo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $pedido = $result->fetch_assoc();
        
        $tallas = [];
        if (!empty($pedido['tallas_json'])) {
            $tallas = json_decode($pedido['tallas_json'], true) ?: [];
        }

        $pedidoFormateado = [
            'codigoSeguimiento' => $pedido['codigo_seguimiento'],
            'gama' => $pedido['gama'],
            'tipo' => $pedido['tipo'],
            'talla' => $pedido['talla'],
            'cantidad' => $pedido['cantidad'],
            'tallas' => $tallas,
            'datosCliente' => [
                'nombre' => $pedido['nombre_cliente'],
                'telefono' => $pedido['telefono_cliente'],
                'email' => $pedido['email_cliente'],
                'direccion' => $pedido['direccion_cliente']
            ],
            'datosEquipo' => [
                'nombre' => $pedido['nombre_equipo'],
                'categoria' => $pedido['categoria_equipo'],
                'colores' => $pedido['colores_equipo']
            ],
            'ideaUniforme' => $pedido['idea_uniforme'],
            'total' => (float)$pedido['total'],
            'estado' => $pedido['estado']
        ];

        echo json_encode(['success' => true, 'pedido' => $pedidoFormateado]);
    } else {
        throw new Exception('Pedido no encontrado');
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

?>
