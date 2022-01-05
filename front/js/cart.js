//EXECUTION DE MES FONCTIONS
document.addEventListener('DOMContentLoaded', () => {
    //RECUPERATION  DES DONNEES LOCALES
    const cart = JSON.parse(localStorage.getItem('cart'))

    //FONCTION AFFICHAGE DU PANIER
    if (cart)
    {
        cart.forEach(productCart => {
            const key = Object.values(localStorage).find(canap => JSON.parse(canap)._id == productCart.id)
            createCart(JSON.parse(key), productCart)
        })
    }

    //RECUPERATION DE QUANTITE
    const select = document.querySelectorAll('.itemQuantity')
    
    //MODIFICATION QUANTITE PANIER
    select.forEach(productQuantity => {
        const ele = productQuantity.closest('article')
        const data_id = ele.dataset.id
        const data_color = ele.dataset.color
        productQuantity.addEventListener('change', () => {
            if (productQuantity.value > 100 || productQuantity.value <= 0) return alert('Veuillez choisir une quantité entre 1 et 100')
            const canap = cart.find(canap => canap.id == data_id && canap.color == data_color)
            canap.quantity = +productQuantity.value
            localStorage.setItem('cart', JSON.stringify(cart))
            total(cart)
        })
        total(cart)
    })

    //SUPPRESSION DU PANIER
    const deleteItem = document.querySelectorAll('.deleteItem')

    deleteItem.forEach(productDelete => {
        const ele = productDelete.closest('article')
        const data_id = ele.dataset.id
        const data_color = ele.dataset.color

        productDelete.addEventListener('click', () => {
            ele.parentNode.removeChild(ele)
            cart.splice(cart.indexOf(cart.find(canape => canape.id === data_id && canape.color === data_color)), 1)
            localStorage.setItem('cart', JSON.stringify(cart))
            alert('Le produit a été retiré du panier')
            window.location.reload()
        })
    })

    //RECUPERATION DES VALEURS DU FORMULAIRE
    const form = document.querySelector('form')
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            const storageForm = {
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                address: e.target.address.value,
                city: e.target.city.value,
                email: e.target.email.value
            }

            //VALIDATION FORMULAIRE
            var test = true
            if (!(e.target.firstName.value).match(/^[A-zÀ-ú' -]*$/)){
                document.getElementById('firstNameErrorMsg').innerHTML = 'Veuillez ne saisir que des caractères alphabétiques'
                test = false
            }
            if (!(e.target.lastName.value).match(/^[A-zÀ-ú' -]*$/)){
                console.log(e.target.lastName.value);
                document.getElementById('lastNameErrorMsg').innerHTML = 'Veuillez ne saisir que des caractères alphabétiques'
                test = false
            }
            if (!(e.target.address.value).match(/^([0-9]*) ?([a-zA-Z,\. ]*) ?([0-9]{5})$/)){
                document.getElementById('addressErrorMsg').innerHTML = 'Veuillez respecter le format adresse : 3 boulevard du Levant 95220'
                test = false
            }
            if (!(e.target.city.value).match(/^[A-zÀ-ú' -]*$/)){
                document.getElementById('cityErrorMsg').innerHTML = 'Veuillez saisir une ville valide'
                test = false
            }
            if (!(e.target.email.value).match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
                document.getElementById('emailErrorMsg').innerHTML = 'Veuillez respecter le format email : johnDoe@gmail.com'
                test = false
            }
            if (test == true) {
                localStorage.setItem("formulaire", JSON.stringify(storageForm))
                //ENVOI DES DONNEES
                const products = []
                for (const item of cart){products.push(item.id)}
                const settings = {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        products,
                        contact : storageForm
                    })
                }
                try {
                    const fetchResponse = await fetch('http://localhost:3000/api/products/order', settings)
                    const data = await fetchResponse.json()
                    location.href=`./confirmation.html?id=${data.orderId}`
                }
                catch {
                    return
                }
            }
        })
    // REMPLISSAGE AUTO FORMULAIRE
    const formLocalStorage = JSON.parse(localStorage.getItem("formulaire"))
    for (const eleForm in formLocalStorage) {
        document.querySelector(`#${eleForm}`).value = formLocalStorage[eleForm];
    }
}
    if (document.getElementById('orderId')){
        displayOrderID()
    }
})

//FONCTION AFFICHAGE PRODUIT
function createCart(canape, productCart) {
    //RECUPERATION DE ID ITEMS DE HTML
    const cart__items = document.getElementById('cart__items')
    if(!cart__items) return
    cart__items.innerHTML +=`
        <article class="cart__item" data-id="${canape._id}" data-color="${productCart.color}">
            <div class="cart__item__img">
                <img src="${canape.imageUrl}" alt="${canape.description}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${canape.name}</h2>
                    <p>${productCart.color}</p>
                    <p>${canape.price}€</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté :  </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productCart.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`
}

//COMPTE ET AFFICHE LE TOTAL
function total(cart) {
    var totalArticle = 0
    var totalPrice = 0
    for (const i of cart) {
        totalArticle += +i.quantity
        totalPrice += +i.price * +i.quantity
    }
    document.getElementById('totalQuantity').innerHTML = totalArticle
    document.getElementById('totalPrice').innerHTML = totalPrice
}


//AFFICHAGE ID COMMANDE
function displayOrderID()
{
    // RECUPERATION DE ID DANS URL
    const params = (new URL(document.location)).searchParams
    const orderID = params.get('id')
    
    document.getElementById('orderId').innerHTML = '<br>' + orderID
    localStorage.removeItem('cart')
}