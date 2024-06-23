const api = axios.create({
  baseURL: "http://localhost:3000",
});

async function renderizaProdutos() {
  try {
    const response = await api.get("/produtos");
    const produtos = response.data;

    if (produtos.length > 0) {
      const containerProdutos = document.getElementById("produtos");
      containerProdutos.innerHTML = "";

      produtos.forEach((produto) => {
        const produtoElement = document.createElement("div");
        produtoElement.className = `flex flex-col justify-between md:min-w-[25%] box-border produto-numero-${produto.id}`;

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

        produtoElement.appendChild(imagemProduto);
        produtoElement.appendChild(tituloProduto);
        produtoElement.appendChild(precoProduto);
        produtoElement.appendChild(btnComprar);
        containerProdutos.appendChild(produtoElement);
      });

      inicializaCarrossel(produtos.length);
    } else {
      const divProdutos = document.getElementById("produtos");
      divProdutos.innerHTML = "";

      const produtoElement = document.createElement("div");
      produtoElement.textContent = "Não foi encontrado produtos.";

      divProdutos.appendChild(produtoElement);
    }
  } catch (error) {
    const divProdutos = document.getElementById("produtos");
    divProdutos.innerHTML = "";

    const produtoElement = document.createElement("div");
    produtoElement.textContent = "Não foi encontrado produtos.";
    divProdutos.appendChild(produtoElement);
    console.error(error);
  }
}

function inicializaCarrossel(totalProdutos) {
  const produtosContainer = document.getElementById("produtos");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  let currentIndex = 0;
  const produtosVisiveis = 4; // Número de produtos visíveis por vez

  function updateCarousel() {
    const offset = currentIndex * -5; // 25% para mover 1 produto
    produtosContainer.style.transform = `translateX(${offset}%)`;
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener("click", () => {
    currentIndex++;
    console.log(currentIndex, Math.ceil(totalProdutos / produtosVisiveis) - 1, totalProdutos, produtosVisiveis);
    updateCarousel();
  });
}

renderizaProdutos();
