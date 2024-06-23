const api = axios.create({
  baseURL: "http://localhost:3000",
});

let total = 0;

async function renderizaCarrinho() {
  const totalContainer = document.getElementById("total");
  totalContainer.className = "flex flex-col justify-center items-center m-2";
  totalContainer.innerHTML = "";

  const response = await api.get("/produtos");
  const produtos = response.data;

  const carrinhoContainer = document.getElementById("carrinho");
  carrinhoContainer.innerHTML = "";
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || { items: [], total: 0 };

  carrinho.items.forEach((item, index) => {
    const produto = document.createElement("div");
    produto.className = "flex flex-row-reverse justify-end items-center gap-2 m-2";

    const produtoBD = produtos.find((produto) => produto.id === item.id);

    const divTexto = document.createElement("div");
    divTexto.className = "flex flex-col";

    const produtoIndex = document.createElement("p");
    produtoIndex.textContent = `Produto ${index + 1}`;

    const produtoNome = document.createElement("p");
    produtoNome.textContent = `${produtoBD.nome}`;

    const imagemProduto = document.createElement("img");
    imagemProduto.src = produtoBD.imagemfrente;
    imagemProduto.id = "imagem-produto";

    imagemProduto.addEventListener("mouseenter", function () {
      imagemProduto.src = produtoBD.imagemcostas;
    });

    imagemProduto.addEventListener("mouseleave", function () {
      imagemProduto.src = produtoBD.imagemfrente;
    });
    imagemProduto.className = "w-1/12";

    const produtoQuantidade = document.createElement("p");
    produtoQuantidade.textContent = `Quantidade: ${item.quantidade}`;

    const precoProdutoUn = document.createElement("p");
    precoProdutoUn.textContent = `Preço Unitário: R$ ${produtoBD.preco.toFixed(2)}`;

    const precoProdutoTotal = document.createElement("p");
    precoProdutoTotal.textContent = `Sub: R$ ${(produtoBD.preco * item.quantidade).toFixed(2)}`;

    const btnExcluir = document.createElement("md-elevated-button");
    btnExcluir.addEventListener("click", () => excluirProdutoCarrinho(item.id));
    btnExcluir.className = "ml-auto mr-2";
    btnExcluir.innerHTML = "<i class='fa-solid fa-trash'></i>";

    const divisor = document.createElement("div");
    divisor.className = "border-b-2 m-2";

    total += produtoBD.preco * item.quantidade;

    divTexto.appendChild(produtoIndex);
    divTexto.appendChild(produtoNome);
    divTexto.appendChild(produtoQuantidade);
    divTexto.appendChild(precoProdutoUn);
    divTexto.appendChild(precoProdutoTotal);
    produto.appendChild(btnExcluir);
    produto.appendChild(divTexto);
    produto.appendChild(imagemProduto);
    carrinhoContainer.appendChild(divisor);
    carrinhoContainer.appendChild(produto);
  });

  const totalTexto = document.createElement("p");
  totalTexto.className = "m-2 text-2xl font-bold text-green-500 ";
  // totalTexto.textContent = `Total: R$ ${total.toFixed(2)}`;
  totalTexto.textContent = `Total: R$ ${carrinho.total.toFixed(2)}`;

  const btnFinalizar = document.createElement("a");
  btnFinalizar.href = "/app/pages/compra/finalizar.html";
  btnFinalizar.innerHTML = "<md-elevated-button>FINALIZAR COMPRA</md-elevated-button>";
  btnFinalizar.className = "m-2";

  totalContainer.appendChild(totalTexto);
  totalContainer.appendChild(btnFinalizar);
}

async function excluirProdutoCarrinho(id) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const produto = carrinho.items.findIndex((item) => item.id === id);

  const response = await api.get("/produtos");
  const produtos = response.data;

  if (produto !== -1) {
    const produtoBD = produtos.find((produto) => produto.id === id);

    carrinho.total -= produtoBD.preco * carrinho.items[produto].quantidade;

    carrinho.items.splice(produto, 1);

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    renderizaCarrinho();
  }
}

renderizaCarrinho();
