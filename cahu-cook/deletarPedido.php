<?php

$host = ****; 
$dbname = ****; 
$user = ****; 
$pass = ****; 

$pedidoId = $_POST['pedidoId'] ?? '';

 
$conn = new mysqli($host, $user, $pass, $dbname);

 
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

 
$sql_delete = "DELETE FROM pedidos WHERE id = '$pedidoId'";

 
if ($conn->query($sql_delete) === TRUE) {
    echo "Pedido excluído com sucesso.";
} else {
    echo "Erro ao excluir o pedido: " . $conn->error;
}

 
$conn->close();
?>