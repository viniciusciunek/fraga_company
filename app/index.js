const api = axios.create({
  baseURL: "http://localhost:3000",
});

let carrinho = [];

async function fetchProdutos() {
  try {
    const response = await api.get("/produtos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

async function renderizaProdutos() {
  const produtos = await fetchProdutos();

  const containerProdutos = document.getElementById("produtos");
  containerProdutos.innerHTML = "";

  if (produtos.length > 0) {
    produtos.forEach((produto) => {
      const produtoElement = document.createElement("div");
      produtoElement.className = "carousel-item flex flex-col justify-between box-border produto-numero-" + produto.id;

      const imagemProduto = document.createElement("img");
      imagemProduto.src = produto.imagemfrente;
      imagemProduto.id = "imagem-produto";

      imagemProduto.addEventListener("mouseenter", function () {
        imagemProduto.src = produto.imagemcostas;
      });

      imagemProduto.addEventListener("mouseleave", function () {
        imagemProduto.src = produto.imagemfrente;
      });

      const tituloProduto = document.createElement("p");
      tituloProduto.textContent = produto.nome;
      tituloProduto.id = "titulo-produto";
      tituloProduto.className = "uppercase mt-2 text-[#050505]";

      const precoProduto = document.createElement("h3");
      if (produto.preco && typeof produto.preco === "number") {
        let precoDividido = produto.preco / 6;
        precoProduto.textContent = `R$ ${produto.preco.toFixed(2)} | 6x R$${precoDividido.toFixed(2)}`;
      } else {
        precoProduto.textContent = "Preço indisponível";
      }
      precoProduto.id = "preco-produto";
      precoProduto.className = "text-[#050505] font-bold text-sm";

      const btnComprar = document.createElement("button");
      btnComprar.textContent = "COMPRAR";
      btnComprar.id = "btn-comprar";
      btnComprar.className = "btn text-white w-full mt-2 rounded-md";

      btnComprar.addEventListener("click", () => {
        adicionarProdutoAoCarrinho(produto.id);
        dialog.show();
      });

      produtoElement.appendChild(imagemProduto);
      produtoElement.appendChild(tituloProduto);
      produtoElement.appendChild(precoProduto);
      produtoElement.appendChild(btnComprar);
      containerProdutos.appendChild(produtoElement);
    });

    inicializaCarrossel(produtos.length);
  } else {
    const produtoElement = document.createElement("div");
    produtoElement.textContent = "Não foi encontrado produtos.";
    containerProdutos.appendChild(produtoElement);
  }
}

function inicializaCarrossel(totalProdutos) {
  const produtosContainer = document.getElementById("produtos");
  const btnPrev = document.getElementById("prev");
  const btnNext = document.getElementById("next");
  let currentIndex = 0;
  const produtosVisiveis = Math.floor(produtosContainer.clientWidth / (produtosContainer.firstElementChild.clientWidth + 16)); // 16px é a gap entre os itens

  function updateCarousel() {
    const offset = (currentIndex * -100) / produtosVisiveis;
    produtosContainer.style.transform = `translateX(${offset}%)`;
  }

  btnPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  btnNext.addEventListener("click", () => {
    if (currentIndex < Math.ceil(totalProdutos / produtosVisiveis) - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  window.addEventListener("resize", () => {
    updateCarousel();
  });
}

async function adicionarProdutoAoCarrinho(produtoId) {
  const produtos = await fetchProdutos();

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || { items: [], total: 0 };
  const produto = carrinho.items.find((item) => item.id === produtoId);

  const produtoBD = produtos.find((item) => item.id == produtoId);

  if (produto) {
    produto.quantidade++;
  } else {
    carrinho.items.push({ id: produtoId, quantidade: 1 });
  }

  carrinho.total += produtoBD.preco;

  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

renderizaProdutos();
