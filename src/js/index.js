let smallPrice;
let modalQuantity = 1;
let cart = [];
let modalKey;

const el = (el) => document.querySelector(el);
const allEl = (el) => document.querySelectorAll(el);

// Listagem de cada pizza
pizzasData.forEach((pizza, index) => {
   const pizzaDiv = el(".pizza-item").cloneNode(true);

   // Infos de cada pizza
   pizzaDiv.setAttribute("data-key", index);
   pizzaDiv.querySelector(".pizza-item--img img").src = pizza.img;
   pizzaDiv.querySelector(".pizza-item--price").innerText = `R$ ${String(
      pizza.price.toFixed(2)
   ).replace(".", ",")}`;
   pizzaDiv.querySelector(".pizza-item--name").innerText = pizza.name;
   pizzaDiv.querySelector(".pizza-item--desc").innerText = pizza.description;

   // Pizza onClick
   pizzaDiv.addEventListener("click", (ev) => {
      ev.preventDefault();
      modalQuantity = 1;
      let key = ev.target.closest(".pizza-item").getAttribute("data-key");
      modalKey = key;

      // Modal Efeito aparecer na tela
      el(".pizzaWindowArea").style.display = "flex";
      setTimeout(() => {
         el(".pizzaWindowArea").style.opacity = 1;
      }, 0);

      // Modal Infos pizza selecionada
      el(".pizzaBig img").src = pizza.img;
      el(".pizzaInfo h1").innerText = pizza.name;
      el(".pizzaInfo--desc").innerText = pizza.description;
      el(".pizzaInfo--actualPrice").setAttribute("data-price", pizza.price);
      smallPrice = el(".pizzaInfo--actualPrice").getAttribute("data-price");
      el(".pizzaInfo--actualPrice").innerText = `R$ ${String(
         pizza.price.toFixed(2)
      ).replace(".", ",")}`;
      el(".pizzaInfo--qt").innerText = modalQuantity;

      // Modal Infos tamanhos
      allEl(".pizzaInfo--size").forEach((size, index) => {
         size.querySelector("span").innerHTML = pizza.sizes[index];
      });
   });

   el(".pizza-area").append(pizzaDiv);
});

// MODAL
// Alterar Quantidade + preço
function calcPrice() {
   const pizzaPrice = el(".pizzaInfo--actualPrice").getAttribute("data-price");
   const total = modalQuantity * pizzaPrice;
   return (el(".pizzaInfo--actualPrice").innerText = `R$ ${String(
      total.toFixed(2)
   ).replace(".", ",")}`);
}
function formatPrice(price) {
   return `R$ ${String(price.toFixed(2)).replace(".", ",")}`;
}
allEl(".pizzaInfo--qtmenos, .pizzaInfo--qtmais").forEach((element, index) => {
   element.addEventListener("click", () => {
      if (index === 0) {
         if (modalQuantity > 1) {
            modalQuantity--;
            calcPrice();
         }
      } else {
         modalQuantity++;
         calcPrice();
      }
      el(".pizzaInfo--qt").innerText = modalQuantity;
   });
});
// Alternar entre tamanhos
allEl(".pizzaInfo--size").forEach((size, index) => {
   size.addEventListener("click", () => {
      el(".pizzaInfo--size.selected").classList.remove("selected");
      size.classList.add("selected");

      if (index === 0) {
         el(".pizzaInfo--actualPrice").setAttribute("data-price", smallPrice);
      } else if (index === 1) {
         el(".pizzaInfo--actualPrice").setAttribute(
            "data-price",
            smallPrice * 1.5
         );
      } else if (index === 2) {
         el(".pizzaInfo--actualPrice").setAttribute(
            "data-price",
            smallPrice * 2
         );
      }
      calcPrice();
   });
});
// Cancelar/Voltar
function closeModal() {
   setTimeout(() => {
      el(".pizzaWindowArea").style.display = "none";
   }, 500);
   el(".pizzaWindowArea").style.opacity = 0;
}
allEl(".pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton").forEach(
   (button) => {
      // Fechar
      button.addEventListener("click", closeModal);
   }
);

// CARRINHO
// Adicionar ao carrinho
el(".pizzaInfo--addButton").addEventListener("click", () => {
   const size = Number(
      el(".pizzaInfo--size.selected").getAttribute("data-key")
   );
   const identifier = `${pizzasData[modalKey].id}-${size}`;
   const key = cart.findIndex((item) => item.identifier == identifier);

   if (key > -1) {
      cart[key].quantity += modalQuantity;
   } else {
      cart.push({
         identifier,
         id: pizzasData[modalKey].id,
         size,
         quantity: modalQuantity,
      });
   }

   window.scrollTo({
      top: 0,
      behavior: "smooth",
   });
   closeModal();
   updateCart();
});
// Atualizar carrinho
function updateCart() {
   el(".menu-openner span").innerHTML = cart.length;

   if (cart.length > 0) {
      el(".cart").innerHTML = "";
      el("aside").classList.add("show");

      let subtotal = 0;
      let discount = 0;
      let total = 0;

      for (let i of cart) {
         const pizzaItem = pizzasData.find((item) => i.id == item.id);
         subtotal += pizzaItem.price * i.quantity;
         // Calc Desconto
         if (i.quantity >= 3 || cart.length >= 3) {
            discount = subtotal * 0.1;
            el(".desconto span").innerText = "Desconto (-10%)";

            if (i.quantity >= 6 || cart.length >= 6) {
               discount = subtotal * 0.2;
               el(".desconto span").innerText = "Desconto (-20%)";

               if (i.quantity >= 9 || cart.length >= 9) {
                  discount = subtotal * 0.3;
                  el(".desconto span").innerText = "Desconto (-30%)";
               }
            }
         } else {
            el(".desconto span").innerText = "Desconto";
         }

         const cartItem = el(".models .cart--item").cloneNode(true);
         let pizzaSize;
         switch (i.size) {
            case 0:
               pizzaSize = "P";
               break;
            case 1:
               pizzaSize = "M";
               break;
            case 2:
               pizzaSize = "G";
               break;
         }
         cartItem.querySelector("img").src = pizzaItem.img;
         cartItem.querySelector(
            ".cart--item-nome"
         ).innerText = `${pizzaItem.name} (${pizzaSize})`;
         cartItem.querySelector(".cart--item--qt").innerText = i.quantity;
         cartItem
            .querySelector(".cart--item-qtmenos")
            .addEventListener("click", () => {
               const index = cart.findIndex((item) => i.id == item.id);
               if (i.quantity > 1) {
                  i.quantity--;
               } else {
                  cart.splice(index, 1);
               }
               updateCart();
            });
         cartItem
            .querySelector(".cart--item-qtmais")
            .addEventListener("click", () => {
               i.quantity++;
               updateCart();
            });

         el(".cart").append(cartItem);
      }
      total = subtotal - discount;

      el(".subtotal span:last-child").innerText = formatPrice(subtotal);
      el(".desconto span:last-child").innerText = formatPrice(discount);
      el(".total span:last-child").innerText = formatPrice(total);
   } else {
      el("aside").classList.remove("show");
      el("aside").style.left = "100vw";
   }
}
// Carrinho Mobile
el(".menu-openner").addEventListener("click", () => {
   if (cart.length > 0) {
      el("aside").style.left = "0";
   }
});
el(".menu-closer").addEventListener("click", () => {
   el("aside").style.left = "100vw";
});
