<?php

$host = ****; 
$dbname = ****; 
$user = ****; 
$pass = ****; 

try {
  
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);

    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $data = json_decode(file_get_contents('php://input'), true);

    // Dados do novo pedido
    $cliente = $data['cliente'];
    $telefone = $data['telefone'];
    $itens = json_encode($data['itens']);
    $total = $data['total'];
    $endereco = $data['endereco'];
    $pagamento = $data['pagamento'];
    $observacoes = $data['observacoes'];
    $id = $data['id'];
    $concluido = $data['concluido'];

   
    $stmt = $pdo->prepare("INSERT INTO pedidos (cliente, telefone, itens, total, endereco, pagamento, observacoes, id, concluido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    $stmt->execute([$cliente, $telefone, $itens, $total, $endereco, $pagamento, $observacoes, $id, $concluido]);

 
    echo "Pedido inserido com sucesso!";
} catch (PDOException $e) {
    
    echo "Erro ao inserir o pedido: " . $e->getMessage();
}
?>
