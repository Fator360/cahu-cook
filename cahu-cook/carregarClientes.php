<?php

$host = ****; 
$dbname = ****; 
$user = ****; 
$pass = ****; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $stmt = $pdo->prepare('SELECT * FROM pedidos');
    $stmt->execute();
    
    
    header('Content-Type: application/json');
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    
    error_log("Erro no banco de dados: " . $e->getMessage());
    echo json_encode(array('error' => 'Erro interno no servidor.'));
}
?>
