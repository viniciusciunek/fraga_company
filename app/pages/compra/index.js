$(document).ready(function () {
  $("#cpf").mask("000.000.000-00");
  $("#telefone").mask("(00) 00000-0000");
  $("#cep").mask("00000-000");
  $("#cartao").mask("0000 0000 0000 0000");

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || { items: [], total: 0 };
  $("#totalCarrinho").text(`R$ ${carrinho.total.toFixed(2)}`);

  $("#cep").on("blur", function () {
    const cep = $(this).val().replace(/\D/g, "");
    if (cep.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => {
          if (response.data.erro) {
            alert("CEP não encontrado.");
          } else {
            $("#endereco").val(`${response.data.logradouro}, ${response.data.bairro}, ${response.data.localidade} - ${response.data.uf}`);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
          alert("Erro ao buscar CEP.");
        });
    } else {
      alert("CEP inválido.");
    }
  });

  $("#formFinalizarCompra").on("submit", function (event) {
    event.preventDefault();

    const nome = $("#nome").val();
    const email = $("#email").val();
    const telefone = $("#telefone").val();
    const cpf = $("#cpf").val();
    const cep = $("#cep").val();
    const endereco = $("#endereco").val();
    const cartao = $("#cartao").val();

    if (!nome || !email || !telefone || !cpf || !cep || !endereco || !cartao) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!validaEmail(email)) {
      alert("insira um email correto.");
      return;
    }

    processarPagamento({ nome, email, telefone, cpf, cartao, total: carrinho.total });
  });
});

function validaEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.[^<>()\[\]\\.,;:\s@"]{2,}))$/i;
  return regex.test(String(email).toLowerCase());
}

function processarPagamento(dados) {
  console.log("Processando pagamento com os seguintes dados:", dados);
  alert("Pagamento processado com sucesso!");
  localStorage.removeItem("carrinho");
  window.location.href = "/app/pages/compra/sucesso.html  ";
}
