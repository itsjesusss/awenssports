<?php
// Incluir conexión
require_once 'conexion.php';

header('Content-Type: application/json');

try {
    // Obtener datos JSON del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    $input = json_decode($json, true);
    
    if (!$input || !isset($input['codigo'])) {
        throw new Exception('Datos inválidos o código no proporcionado');
    }

    $codigo = $input['codigo'];
    
    // Crear instancia de conexión
    $db = new Conexion();
    $conexion = $db->conexion;

    // Primero verificar que el pedido existe y está en revisión
    $sqlCheck = "SELECT estado FROM pedidos WHERE codigo_seguimiento = ?";
    $stmtCheck = $conexion->prepare($sqlCheck);
    
    if (!$stmtCheck) {
        throw new Exception("Error preparando consulta de verificación: " . $conexion->error);
    }
    
    $stmtCheck->bind_param("s", $codigo);
    $stmtCheck->execute();
    $stmtCheck->bind_result($estado);
    $stmtCheck->fetch();
    $stmtCheck->close();

    if (!$estado) {
        throw new Exception('Pedido no encontrado');
    }

    if ($estado !== 'revision') {
        throw new Exception('El pedido ya no está en revisión. Estado actual: ' . $estado);
    }

    // Eliminar el pedido
    $sqlDelete = "DELETE FROM pedidos WHERE codigo_seguimiento = ?";
    $stmtDelete = $conexion->prepare($sqlDelete);
    
    if (!$stmtDelete) {
        throw new Exception("Error preparando consulta de eliminación: " . $conexion->error);
    }

    $stmtDelete->bind_param("s", $codigo);

    if ($stmtDelete->execute()) {
        if ($stmtDelete->affected_rows > 0) {
            echo json_encode([
                'success' => true, 
                'message' => 'Pedido cancelado correctamente',
                'codigo' => $codigo
            ]);
        } else {
            throw new Exception('No se pudo cancelar el pedido. Es posible que ya haya sido eliminado.');
        }
    } else {
        throw new Exception("Error ejecutando consulta: " . $stmtDelete->error);
    }

    $stmtDelete->close();
    $conexion->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
}
?>