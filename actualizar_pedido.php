<?php
// Incluir conexión
require_once 'Conexion.php';

header('Content-Type: application/json');

try {
    // Obtener datos JSON
    $json = file_get_contents('php://input');
    $input = json_decode($json, true);
    
    if (!$input || json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Datos JSON inválidos');
    }

    // Validar campos requeridos
    $required = ['codigoSeguimiento', 'gama', 'tipo', 'tallas', 'cantidad', 'datosCliente', 'datosEquipo', 'ideaUniforme', 'total'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Campo faltante: $field");
        }
    }

    // Crear instancia de conexión
    $db = new Conexion();
    $conexion = $db->conexion;

    // Extraer datos
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

    // Preparar consulta SQL
    $sql = "UPDATE pedidos SET 
            gama = ?, 
            tipo = ?, 
            talla = ?, 
            cantidad = ?, 
            nombre_cliente = ?, 
            telefono_cliente = ?, 
            email_cliente = ?, 
            direccion_cliente = ?, 
            nombre_equipo = ?, 
            categoria_equipo = ?, 
            colores_equipo = ?, 
            idea_uniforme = ?, 
            total = ?, 
            tallas_json = ? 
            WHERE codigo_seguimiento = ? AND estado = 'revision'";
    
    // Preparar statement
    $stmt = $conexion->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta: " . $conexion->error);
    }

    // Bind parameters
    $stmt->bind_param(
        "sssissssssssdss",
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
        $tallas_json,
        $codigo_seguimiento
    );

    // Ejecutar
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['success' => true, 'message' => 'Pedido actualizado correctamente']);
        } else {
            // Puede que el pedido ya no esté en revisión o no exista
            // Verificar el estado actual
            $sql_check = "SELECT estado FROM pedidos WHERE codigo_seguimiento = ?";
            $stmt_check = $conexion->prepare($sql_check);
            $stmt_check->bind_param("s", $codigo_seguimiento);
            $stmt_check->execute();
            $stmt_check->bind_result($estado_actual);
            $stmt_check->fetch();
            $stmt_check->close();
            
            if ($estado_actual) {
                echo json_encode(['success' => false, 'message' => 'El pedido ya no está en revisión. Estado actual: ' . $estado_actual]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Pedido no encontrado']);
            }
        }
    } else {
        throw new Exception("Error ejecutando consulta: " . $stmt->error);
    }

    // Cerrar conexión
    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    // Manejar errores
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
