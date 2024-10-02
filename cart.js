"use strict";
/*___________________ TOGGLE _____________________*/
const cestaIcon = document.getElementById("cesta");
const boxCart = document.getElementById("boxCart");
if (cestaIcon && boxCart) {
    cestaIcon.addEventListener("click", () => {
        if (boxCart.style.transform === "translateX(0%)") {
            boxCart.style.transform = "translateX(100%)";
            cestaIcon.className = "fa fa-shopping-basket";
        }
        else {
            boxCart.style.transform = "translateX(0%)";
            cestaIcon.className = "fa fa-times";
        }
    });
}
else {
    console.error("'cesta' ou 'boxCart' não foi encontrado no DOM.");
}
