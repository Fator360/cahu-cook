var menuItems;
var botaoFin = document.getElementById("finalizarPedido");
var botaoConc = document.getElementById("concluirPedido");
var categorias;
var listaItens = [];

var novoPedido = { 
  "cliente": "",
  "telefone": "",
  "itens": "",
  "total": 0,
  "endereco": "",
  "pagamento": "",
  "observacoes": "",
  "id":0,
  "concluido": false
};

fetch('gerarId.php')
    .then(response => response.text())
    .then(id => {
        novoPedido.id = id;
        console.log(novoPedido);
    })
    .catch(error => console.error('Erro ao gerar ID:', error));

var secAlerta = document.getElementById("alerta");
var secFazer = document.getElementById("fazerpedido");
var secFinalizar = document.getElementById("finalizarpedido");
var secEndereco = document.getElementById("endereco");
var secConc = document.getElementById("pedidoConcluido");
var enderecoInput = document.getElementById("endereco-input");
var secPagamento = document.getElementById("pagamento");
var inputNome = document.getElementById("nome-input");
var inputTel = document.getElementById("telefone-input");
var inputObs = document.getElementById("obs-input");
var botMenu = document.getElementById("botMenu");

function salvarPedidoNoArquivo(pedido) {
    listaItens.forEach(function (item){
    if (item == listaItens[0]){
        novoPedido.itens += item.Nome;
    }else{
        novoPedido.itens += ", "
        novoPedido.itens += item.Nome;
    }
    });
    console.log(novoPedido);
    console.log(novoPedido.itens);
  if (novoPedido.cliente == '' || enderecoInput.required == true && novoPedido.endereco == '' || novoPedido.pagamento == '' || novoPedido.telefone == ''){
    secAlerta.style.display = 'block';
  }else {
    secAlerta.style.display = 'none';
  const url = 'salvarPedido.php';
  console.log('Dados a serem enviados:', pedido);
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pedido),
  })
    .then(response => response.text())
    .then(result => {
      console.log('Resposta do servidor:', result);
    })
    .catch(error => {
      console.error('Erro ao enviar o pedido:', error);
    });
    secConc.style.display = 'block';
    secFinalizar.style.display = 'none';
    document.body.scrollTop = 0;}
}

function loadMenuItems() {
  const url = 'carregarPedidos.php';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      menuItems = data;
      console.log(data);
      generateRepeatingGroup(menuItems); 
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function removerItemDoCarrinho(index) {
    novoPedido.total -= parseInt(listaItens[index].Preço);
    listaItens.splice(index, 1);
    generateRepeatingGroupPedido();
    mostrarPreco();
    if (listaItens.length == 0){
      exporPedido(); 
    } 
    else {
      botaoFin.innerHTML = "Prosseguir (" + listaItens.length + ")";
    }
  }

function generateRepeatingGroupPedido() {
  var repeatingGroupPedido = document.getElementById('itens-bg');
  repeatingGroupPedido.innerHTML = '';

    listaItens.forEach(function (pedidoItem) {
    var itemDiv = document.createElement('div');
    itemDiv.className = 'itemPedido';
    itemDiv.innerHTML = `
      <div class="item-pedido" style="display: flex; justify-content: space-between; margin: 0 auto; max-width: 600px;">
        <span>${pedidoItem.Nome}</span>
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 10px;">Preço:R$ ${pedidoItem.Preço}</span>
          <button class="botao-delete">Remover</button>
        </div>
      </div>
    `;

    repeatingGroupPedido.appendChild(itemDiv);
  });
  repeatingGroupPedido.querySelectorAll('.botao-delete').forEach(function (button, index) {
    button.addEventListener('click', function () {
      removerItemDoCarrinho(index);
    });
    });
  }


function mostrarPreco(){
  var valorTotal = document.getElementById("valorTotal");
  valorTotal.innerHTML = "R$" + novoPedido.total;
}

function generateRepeatingGroup(items) {

  function adicionarCarrinho(itemNome) {
    var itemSelecionado = menuItems.filter(item => item.Nome === itemNome)[0];
    listaItens.push(itemSelecionado);
    novoPedido.total += parseInt(itemSelecionado.Preço);
    botaoFin.classList.remove('ocultarbot');
    botaoFin.innerHTML = "Prosseguir (" + listaItens.length + ")";
    console.log(novoPedido);
  }

  var repeatingGroup = document.getElementById('repeatingGroup');
  repeatingGroup.innerHTML = '';

  items.forEach(function (item, index) {
    var itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = ` <div style="margin: 0 auto; max-width: 600px;">
    <img src="${item.Imagem}" alt="${item.Nome}" width="150" style="float: left; margin-right: 0px; border-radius: 15px; width: 30%;">
    <div style="float: right; width: 70%;">
      <strong>${item.Nome}</strong><br>
      <em>${item.Descrição}</em><br>
      <br>
      Preço: R$ ${typeof item.Preço === 'number' ? item.Preço.toFixed(2) : item.Preço}
      <button class="botaoadd" data-index="${item.Nome}">Adicionar ao carrinho <b>+</b></button>
    </div>
    <div style="clear: both;"></div>
  </div>
`;
    repeatingGroup.appendChild(itemDiv);
  });

  repeatingGroup.querySelectorAll('.botaoadd').forEach(function (button) {
    button.addEventListener('click', function () {
      var index = this.getAttribute('data-index');
      adicionarCarrinho(index);
    });
  });
}

function adicionarManipuladoresEventos() {
  botaoConc.addEventListener('click', function(){salvarPedidoNoArquivo(novoPedido)});
  botaoFin.addEventListener('click', exporFinalizar);
  var categorias = document.getElementsByName('categoria');
  categorias.forEach(function (categoria) {
  categoria.addEventListener('change', filtrarPorCategoria);
  });
  var opcoesEndereco = document.getElementsByName('receber');
  opcoesEndereco.forEach(function (opcoesEndereco){
    opcoesEndereco.addEventListener('change', endereco);
  })
  enderecoInput.addEventListener('change', atualizarEndereco);
  var opcoesPagamento = document.getElementsByName('pagamento');
  opcoesPagamento.forEach(function (opcoesPagamento){
  opcoesPagamento.addEventListener('change', pagamento);
  })
  inputNome.addEventListener('change', atualizarNome);
  inputTel.addEventListener('change', atualizarTel);
  inputObs.addEventListener('change', atualizarObs);
  botMenu.addEventListener('click', resetFinal);
}

function resetFinal(){
window.location.reload();
}

function atualizarNome(){
novoPedido.cliente = inputNome.value;
}

function atualizarTel(){
novoPedido.telefone = inputTel.value;
}

function atualizarObs(){
novoPedido.observacoes = inputObs.value;
}

function pagamento(){
var pagamentoSelecionadoInput = document.querySelector('input[name="pagamento"]:checked').value;
console.log(pagamentoSelecionadoInput);
novoPedido.pagamento = pagamentoSelecionadoInput;
console.log(novoPedido);
}

function atualizarEndereco(){
  novoPedido.endereco = enderecoInput.value;
  console.log(novoPedido);
}

function endereco(){
  var opcaoSelecionada = document.querySelector('input[name="receber"]:checked').value;
  if (opcaoSelecionada == "entrega"){
    secEndereco.style.display = 'block';
    enderecoInput.required = true;
  }
  else {
    secEndereco.style.display = 'none';
    novoPedido.endereco = '';
    console.log(novoPedido);
    enderecoInput.required = false;
  }
}

function generateCategorias(items) {
  function filtrarPorCategoria() {
    var categoriaSelecionadaInput = document.querySelector('input[name="categoria"]:checked');
    var todasLabels = document.querySelectorAll('label[name="categoria"]');

    todasLabels.forEach(function (label) {
      if (label.htmlFor === categoriaSelecionadaInput.id) {
        label.style.backgroundColor = 'black';
        label.style.color = 'white';
      } else {
        label.style.backgroundColor = 'white';
        label.style.color = 'black';
      }
    });

    if (categoriaSelecionadaInput) {
      var categoriaSelecionada = categoriaSelecionadaInput.value;
      var itensFiltrados;
      console.log("Filtrar por categoria específica:", categoriaSelecionada);
      itensFiltrados = menuItems && Array.isArray(menuItems) ? menuItems.filter(item => item.Categoria === categoriaSelecionada) : [];
      generateRepeatingGroup(itensFiltrados);
      console.log("Filtrado");
    }
  }

  var rgCategoria = document.getElementById('categorias');
  rgCategoria.innerHTML = '';

  items.forEach(function (item, index) {
    var itemLabel = document.createElement('label');
    itemLabel.innerHTML = `${item.Nome}`;
    itemLabel.htmlFor = item.Nome;
    itemLabel.style.margin = "5px";
    itemLabel.name = "categoria"; 
    var itemInput = document.createElement('input')
    itemInput.type = "radio";
    itemInput.id = item.Nome;
    itemInput.name = "categoria";
    itemInput.value = item.Nome;
    itemInput.addEventListener('change', filtrarPorCategoria);
    rgCategoria.appendChild(itemLabel);
    rgCategoria.appendChild(itemInput);
  });
}


function loadCategorias() {
  const url = 'carregarCategorias.php';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      categorias = data;
      generateCategorias(categorias);
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });
}

function pedido() {
  console.log('Pedido Atual:', novoPedido);
};

function exporFinalizar(){
  secFazer.style.display = "none";
  secFinalizar.style.display = "block";
  var botaoVoltar = document.getElementById("botaoVoltar");
  var botaoAdicionar = document.getElementById("botaoAdicionar");
  botaoVoltar.addEventListener('click', exporPedido);
  botaoAdicionar.addEventListener('click', exporPedido);
  generateRepeatingGroupPedido();
  mostrarPreco();
  document.body.scrollTop = 0;
};

function exporPedido(){
  secFazer.style.display = "block";
  secFinalizar.style.display = "none"; 
  botaoFin.innerHTML = "Prosseguir (" + listaItens.length + ")";
  if (listaItens == 0){
      botaoFin.classList.add('ocultarbot');
  }
}

window.onload = function () {
    loadCategorias();
  loadMenuItems();
  adicionarManipuladoresEventos();
};


