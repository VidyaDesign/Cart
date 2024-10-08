class Produtos {
  private id: string;
  private categoria: string;
  private titulo: string;
  private preco: number;
  private imagem: string;
  private qtd: number;

  constructor(
    id: string,
    categoria: string,
    titulo: string,
    preco: number,
    imagem: string
  ) {
    this.id = id;
    this.categoria = categoria;
    this.titulo = titulo;
    this.preco = preco;
    this.imagem = imagem;
    this.qtd = 1; // Inicializa a quantidade como 1
  }

  // Método para gerar o cartão do produto na interface
  public gerarCardProduto(): HTMLElement {
    const boxCard = document.createElement("div");
    boxCard.classList.add("boxCard");

    const boxImage = document.createElement("div");
    boxImage.classList.add("boxImage");

    const img = document.createElement("img");
    img.src = this.imagem;
    img.alt = this.titulo;
    img.title = this.titulo;

    const button = document.createElement("button");
    button.classList.add("btnAdd");
    button.innerHTML = `<i class="fa fa-shopping-basket"><span>Add to Cart</span></i>`;
    button.dataset.produtoId = this.id; // ID do produto adicionado ao botão

    // Adiciona evento ao botão para adicionar ao carrinho
    button.addEventListener("click", () => {
      this.adicionarAoCarrinho();
      Produtos.atualizarTotalGeral(); // Atualiza o total sempre que um item é adicionado
    });

    const categoria = document.createElement("p");
    categoria.classList.add("categoria");
    categoria.textContent = this.categoria;

    const titulo = document.createElement("p");
    titulo.classList.add("titulo");
    titulo.textContent = this.titulo;

    const preco = document.createElement("p");
    preco.classList.add("preco");
    preco.textContent = `$${this.preco.toFixed(2)}`;

    const id = document.createElement("span");
    id.classList.add("id");
    id.textContent = this.id;
    id.style.display = "none"; // Esconde o ID

    // Monta o card do produto
    boxImage.appendChild(img);
    boxImage.appendChild(button);
    boxCard.appendChild(boxImage);
    boxCard.appendChild(categoria);
    boxCard.appendChild(titulo);
    boxCard.appendChild(preco);
    boxCard.appendChild(id);

    return boxCard;
  }

  // Adiciona o produto ao carrinho
  private adicionarAoCarrinho(): void {
    const boxCart = document.getElementById("boxCart");
    if (!boxCart) return;

    // Busca o container com a classe 'boxItens'
    let boxItens = boxCart.querySelector(".boxItens");

    // Se não houver um container com a classe 'boxItens', cria um novo e adiciona ao 'boxCart'
    if (!boxItens) {
      boxItens = document.createElement("div");
      boxItens.classList.add("boxItens");
      boxCart.appendChild(boxItens);
    }

    // Verifica se o item já está no carrinho
    const existingItem = boxItens.querySelector(
      `.titulo[data-produto-id="${this.id}"]`
    );

    if (existingItem) {
      // Se o item já existe, incrementa a quantidade e atualiza o preço
      const qtdElement = existingItem
        .closest(".itens")
        ?.querySelector(".qtd") as HTMLElement;
      const precoElement = existingItem
        .closest(".itens")
        ?.querySelector(".precoSoma") as HTMLElement;

      this.qtd += 1;
      qtdElement.textContent = `${this.qtd}x`;
      const totalPreco = this.preco * this.qtd;
      precoElement.textContent = `$${totalPreco.toFixed(2)}`;
    } else {
      // Se o item não existe, cria um novo dentro de 'boxItens'
      const itensDiv = document.createElement("div");
      itensDiv.className = "itens";

      itensDiv.innerHTML = `
      <table>
        <tr>
          <th colspan="3"><span id="titulo" class="titulo" data-produto-id="${this.id
        }">${this.titulo}</span></th> 
        </tr>
        <tr>
          <td class="qtd">${this.qtd}x</td> 
          <td id='preco' class="td2">@ ${this.preco.toFixed(2)}</td> 
          <td class="precoSoma">$${this.preco.toFixed(2)}</td> 
        </tr>
      </table>
      <button id="menus"><i class="fa fa-minus" aria-hidden="true"></i></button>
      <button id="mais"><i class="fa fa-plus" aria-hidden="true"></i></button>
    `;

      // Usa prepend para adicionar o item no topo dentro de 'boxItens'
      boxItens.prepend(itensDiv);

      // Eventos para os botões de aumentar/diminuir quantidade
      const btnMenus = itensDiv.querySelector("#menus");
      const btnMais = itensDiv.querySelector("#mais");

      btnMenus?.addEventListener("click", () =>
        this.modificarQuantidade(itensDiv, -1)
      );
      btnMais?.addEventListener("click", () =>
        this.modificarQuantidade(itensDiv, 1)
      );
    }

    Produtos.atualizarTotalGeral(); // Atualiza o total
  }

  // Modifica a quantidade do produto no carrinho
  private modificarQuantidade(itensDiv: HTMLElement, delta: number): void {
    this.qtd += delta;

    const qtdElement = itensDiv.querySelector(".qtd") as HTMLElement;
    const precoElement = itensDiv.querySelector("#preco") as HTMLElement;
    const precoSomaElement = itensDiv.querySelector(
      ".precoSoma"
    ) as HTMLElement;

    if (this.qtd <= 0) {
      // Remove o item se a quantidade for zero ou menor
      itensDiv.remove();
    } else {
      // Atualiza a quantidade e o preço
      qtdElement.textContent = `${this.qtd}x`;
      this.atualizarPreco(precoElement, precoSomaElement);
    }

    // Atualiza o valor total
    Produtos.atualizarTotalGeral();
  }

  // Atualiza o preço individual do produto
  private atualizarPreco(
    precoElement: HTMLElement,
    precoSomaElement: HTMLElement
  ): void {
    const totalPreco = this.preco * this.qtd;
    precoElement.textContent = `@${this.preco.toFixed(2)}`;
    precoSomaElement.textContent = `$${totalPreco.toFixed(2)}`;
  }

  // Método estático para atualizar o valor total do carrinho e a quantidade total
  public static atualizarTotalGeral(): void {
    const precoSomas = document.querySelectorAll(".precoSoma");
    const qtdElements = document.querySelectorAll(".qtd");
    let total = 0;
    let qtdTotal = 0;

    // Soma os valores de todos os itens no carrinho
    precoSomas.forEach((element) => {
      const valor = parseFloat(element.textContent?.replace("$", "") || "0");
      total += valor;
    });

    // Soma as quantidades de todos os itens no carrinho
    qtdElements.forEach((element) => {
      const qtdValue = parseInt(element.textContent?.replace("x", "") || "0");
      qtdTotal += qtdValue;
    });

    // Atualiza o valor total na interface
    const totalElement = document.getElementById("total");
    if (totalElement) {
      totalElement.textContent = `$${total.toFixed(2)}`; // Atualiza o valor total
    }

    // Atualiza a quantidade total na interface
    const qtdGeralElement = document.getElementById("qtdGeral");
    if (qtdGeralElement) {
      qtdGeralElement.textContent = `(${qtdTotal})`; // Atualiza a quantidade total
    }

    // Verifica se o total é maior que 0 para mostrar ou esconder a classe 'emptyCart'
    const emptyCartElement = document.querySelector(
      ".emptyCart"
    ) as HTMLElement;
    if (emptyCartElement) {
      if (total > 0) {
        emptyCartElement.style.display = "none"; // Esconde a mensagem de carrinho vazio
      } else {
        emptyCartElement.style.display = "flex"; // Mostra a mensagem de carrinho vazio
      }
    }
  }
}

// Função para adicionar produtos na interface (executada ao carregar a página)
function adicionarProdutosNoContainer() {
  const container = document.querySelector(".container");
  if (!container) return;

  const produtos = [
    new Produtos(
      "CO001",
      "Waffle",
      "Waffle with Berries",
      6.5,
      "assets/images/image-waffle-desktop.jpg"
    ),
    new Produtos(
      "CO002",
      "Crème Brûlée",
      "Vanilla Bean Crème Brûlée",
      7.0,
      "assets/images/image-creme-brulee-desktop.jpg"
    ),
    new Produtos(
      "CO003",
      "Macaron",
      "Macaron Mix of Five",
      8.0,
      "assets/images/image-macaron-desktop.jpg"
    ),
    new Produtos(
      "CO004",
      "Tiramisu",
      "Classic Tiramisu",
      5.5,
      "assets/images/image-tiramisu-desktop.jpg"
    ),
    new Produtos(
      "CO005",
      "Baklava",
      "Pistachio Baklava",
      4.0,
      "assets/images/image-baklava-desktop.jpg"
    ),
    new Produtos(
      "CO006",
      "Pie",
      "Lemon Meringue Pie",
      5.0,
      "assets/images/image-meringue-desktop.jpg"
    ),
    new Produtos(
      "CO007",
      "Cake",
      "Red Velvet Cake",
      4.5,
      "assets/images/image-cake-desktop.jpg"
    ),
  ];

  // Gera e insere os cards de produtos no container
  produtos.forEach((produto) => {
    const card = produto.gerarCardProduto();
    container.appendChild(card);
  });
}

// Executa a função ao carregar a página
//window.onload = adicionarProdutosNoContainer;
document.addEventListener("DOMContentLoaded", adicionarProdutosNoContainer);

