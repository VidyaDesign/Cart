"use strict";
class Produtos {
    constructor(id, categoria, titulo, preco, imagem) {
        this.id = id;
        this.categoria = categoria;
        this.titulo = titulo;
        this.preco = preco;
        this.imagem = imagem;
        this.qtd = 1; // Inicializa a quantidade como 1
    }
    // Método para gerar o cartão do produto na interface
    gerarCardProduto() {
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
    adicionarAoCarrinho() {
        var _a, _b;
        const boxCart = document.getElementById("boxCart");
        if (!boxCart)
            return;
        // Busca o container com a classe 'boxItens'
        let boxItens = boxCart.querySelector(".boxItens");
        // Se não houver um container com a classe 'boxItens', cria um novo e adiciona ao 'boxCart'
        if (!boxItens) {
            boxItens = document.createElement("div");
            boxItens.classList.add("boxItens");
            boxCart.appendChild(boxItens);
        }
        // Verifica se o item já está no carrinho
        const existingItem = boxItens.querySelector(`.titulo[data-produto-id="${this.id}"]`);
        if (existingItem) {
            // Se o item já existe, incrementa a quantidade e atualiza o preço
            const qtdElement = (_a = existingItem
                .closest(".itens")) === null || _a === void 0 ? void 0 : _a.querySelector(".qtd");
            const precoElement = (_b = existingItem
                .closest(".itens")) === null || _b === void 0 ? void 0 : _b.querySelector(".precoSoma");
            this.qtd += 1;
            qtdElement.textContent = `${this.qtd}x`;
            const totalPreco = this.preco * this.qtd;
            precoElement.textContent = `$${totalPreco.toFixed(2)}`;
        }
        else {
            // Se o item não existe, cria um novo dentro de 'boxItens'
            const itensDiv = document.createElement("div");
            itensDiv.className = "itens";
            itensDiv.innerHTML = `
      <table>
        <tr>
          <th colspan="3"><span id="titulo" class="titulo" data-produto-id="${this.id}">${this.titulo}</span></th> 
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
            btnMenus === null || btnMenus === void 0 ? void 0 : btnMenus.addEventListener("click", () => this.modificarQuantidade(itensDiv, -1));
            btnMais === null || btnMais === void 0 ? void 0 : btnMais.addEventListener("click", () => this.modificarQuantidade(itensDiv, 1));
        }
        Produtos.atualizarTotalGeral(); // Atualiza o total
    }
    // Modifica a quantidade do produto no carrinho
    modificarQuantidade(itensDiv, delta) {
        this.qtd += delta;
        const qtdElement = itensDiv.querySelector(".qtd");
        const precoElement = itensDiv.querySelector("#preco");
        const precoSomaElement = itensDiv.querySelector(".precoSoma");
        if (this.qtd <= 0) {
            // Remove o item se a quantidade for zero ou menor
            itensDiv.remove();
        }
        else {
            // Atualiza a quantidade e o preço
            qtdElement.textContent = `${this.qtd}x`;
            this.atualizarPreco(precoElement, precoSomaElement);
        }
        // Atualiza o valor total
        Produtos.atualizarTotalGeral();
    }
    // Atualiza o preço individual do produto
    atualizarPreco(precoElement, precoSomaElement) {
        const totalPreco = this.preco * this.qtd;
        precoElement.textContent = `@${this.preco.toFixed(2)}`;
        precoSomaElement.textContent = `$${totalPreco.toFixed(2)}`;
    }
    // Método estático para atualizar o valor total do carrinho e a quantidade total
    static atualizarTotalGeral() {
        const precoSomas = document.querySelectorAll(".precoSoma");
        const qtdElements = document.querySelectorAll(".qtd");
        let total = 0;
        let qtdTotal = 0;
        // Soma os valores de todos os itens no carrinho
        precoSomas.forEach((element) => {
            var _a;
            const valor = parseFloat(((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.replace("$", "")) || "0");
            total += valor;
        });
        // Soma as quantidades de todos os itens no carrinho
        qtdElements.forEach((element) => {
            var _a;
            const qtdValue = parseInt(((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.replace("x", "")) || "0");
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
        const emptyCartElement = document.querySelector(".emptyCart");
        if (emptyCartElement) {
            if (total > 0) {
                emptyCartElement.style.display = "none"; // Esconde a mensagem de carrinho vazio
            }
            else {
                emptyCartElement.style.display = "flex"; // Mostra a mensagem de carrinho vazio
            }
        }
    }
}
// Função para adicionar produtos na interface (executada ao carregar a página)
function adicionarProdutosNoContainer() {
    const container = document.querySelector(".container");
    if (!container)
        return;
    const produtos = [
        new Produtos("CO001", "Waffle", "Waffle with Berries", 6.5, "image-waffle-desktop.jpg"),
        new Produtos("CO002", "Crème Brûlée", "Vanilla Bean Crème Brûlée", 7.0, "image-creme-brulee-desktop.jpg"),
        new Produtos("CO003", "Macaron", "Macaron Mix of Five", 8.0, "image-macaron-desktop.jpg"),
        new Produtos("CO004", "Tiramisu", "Classic Tiramisu", 5.5, "image-tiramisu-desktop.jpg"),
        new Produtos("CO005", "Baklava", "Pistachio Baklava", 4.0, "image-baklava-desktop.jpg"),
        new Produtos("CO006", "Pie", "Lemon Meringue Pie", 5.0, "image-meringue-desktop.jpg"),
        new Produtos("CO007", "Cake", "Red Velvet Cake", 4.5, "image-cake-desktop.jpg"),
    ];
    // Gera e insere os cards de produtos no container
    produtos.forEach((produto) => {
        const card = produto.gerarCardProduto();
        container.appendChild(card);
    });
}
// Executa a função ao carregar a página
window.onload = adicionarProdutosNoContainer;
//document.addEventListener("DOMContentLoaded", adicionarProdutosNoContainer);
