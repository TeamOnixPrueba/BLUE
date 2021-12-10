// REVISION ------ 1.0
// SP: ----------- PN-0002747
// DATE: --------- 22-11-2021
// DESCRIPTION: -- funciones para los elementos: campo de texto
// AUTHOR: ------- scontreras(1.0)
// WORKTEAM: ----- Onix (1.0)
// version 1.0


//	Seleccionando todos los elementos que contienen la clase input-main (retorna un array)

document.querySelectorAll('.input-main')
    // recorriendo los elementos
    .forEach(element => {
        //	Añadiendo evento focus al elemento
        element.addEventListener('focus', ({target}) => {
            //	Añadiendo una nueva clase al elemento
            target.classList.add("input-main_default");
        });
    });

//	Seleccionando todos los elementos que contienen la clase input-currency (retorna un array)
document.querySelectorAll('.input-currency')
    // recorriendo los elementos
    .forEach(element => {
        //	Añadiendo evento focus al elemento
        element.addEventListener('focus', ({target}) => {
            //	Validando mediante una expresion regular si el padre del elemento contiene una clase en especifico
            const hasClass = /currency-content/gi.test(target.parentNode.className);

            //	Si contiene  la clase haremos los siguiente
            if (hasClass) {
                //	removiendo una clase del elemento
                target.classList.remove("input-main_default");
                //	añadiendo una clase del elemento padre
                target.parentNode.classList.add("input-line");
            }
        });
    });

//Funcionalidad para el componente input Mostrar - Ocultar

document.querySelectorAll('.input-password')
    .forEach(element => {
        const spanTag = element.querySelector('span');
        const spanTagDefaultTextContent = spanTag.textContent;
        const spanTagHiddenMessage = spanTag.getAttribute("data-hidden-message");
        const inputTag = element.querySelector('input');

        spanTag.addEventListener('click', () => {
            const passwordInputType = inputTag.getAttribute("type");

            inputTag.focus();

            if (passwordInputType && /password/i.test(passwordInputType)) {
                inputTag.setAttribute("type", "text");
                spanTag.textContent = spanTagHiddenMessage;
            } else {
                inputTag.setAttribute("type", "password");
                spanTag.textContent = spanTagDefaultTextContent;
            }
        });

        inputTag.addEventListener('keyup', ({target}) => {
            const {value} = target;

            if (value) spanTag.style.visibility = 'visible';
            else spanTag.style.visibility = 'hidden';
        });
    })

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const ripple = button.getElementsByClassName("ripple")[0];

    circle.style.width = this.clientWidth + "px";
    circle.style.height = this.clientHeight + "px";
    circle.style.left = (event.layerX - (this.clientWidth / 2) - this.offsetLeft) + "px";
    circle.style.top = 0 + "px";
    circle.classList.add("ripple");

    if (ripple) ripple.remove();

    button.appendChild(circle);
}

/**Llamada a la funcion createRipple despues de que la pantalla este cargada
 * para agregarle a los botones primario la animacion
 */

window.addEventListener('load', function () {
    const buttons = document.getElementsByClassName("btn-primary");

    for (const button of buttons) button.addEventListener("click", createRipple);
});


//Agrega el focus a la lista de componentes y lo elimina si fue realizado por un click
document.addEventListener("DOMContentLoaded", function () {
    const componentsClass = ".btn";

    document.querySelectorAll(componentsClass).forEach(element => {
        element.addEventListener('focus', () => element.classList.add('tab-focus'));

        element.addEventListener('blur', () => element.classList.remove('tab-focus'));

        element.addEventListener('click', () => element.classList.remove('tab-focus'));
    });
});