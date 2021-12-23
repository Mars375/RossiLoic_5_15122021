// RECUPERATION DE ID DANS URL
const params = (new URL(document.location)).searchParams
const canapID = params.get('id'); // on récupère l'id du canapé

//EXECUTION DE MES FONCTIONS
document.addEventListener('DOMContentLoaded', () => {

//RECUPERATION DU CANAPE
    const canape = JSON.parse(localStorage.getItem(canapID))

//AJOUT INFOS CANAPE
    document.getElementById('title').innerHTML = canape.name
    document.getElementById('price').innerHTML = canape.price
    document.getElementById('description').innerHTML = canape.description
    addOption(canape)
    addImg(canape)

//AJOUT AU PANIER
    var click = document.getElementById("addToCart");
    click.onclick = addCart
})

//AJOUTS DES OPTIONS DE COULEURS
function addOption(canape) {

    const colors = document.getElementById('colors')

    canape.colors.forEach (option => {
        const newOption = document.createElement('option')
        const newContent = document.createTextNode(option)
        newOption.value = option
        newOption.appendChild(newContent)
        colors.appendChild(newOption)
    })
}

//AJOUT IMAGE
function addImg(canape) {

    const image = document.querySelector('.item__img')    
    const newImg = document.createElement('img')
    
    newImg.src = canape.imageUrl
    image.appendChild(newImg)
}

//FONCTION AJOUT PANIER
function addCart() {
    const storageArray = JSON.parse(localStorage.getItem('cart')) || []
    const canapQuantity = document.getElementById('quantity').value
    const canapColor = document.getElementById('colors').value
    const canapPrice = document.getElementById('price').innerHTML
    const findCanap = storageArray.find(canap => canap.id == canapID && canap.color == canapColor)

    //VERIFICATION PRESENCE CANAPE DEJA EXISTANT 
    if (canapQuantity > 100 || canapQuantity <= 0) return alert('Veuillez choisir une quantité entre 1 et 100')
    if (!canapColor) return alert('Veuillez choisir une couleur disponible')
    if (findCanap) {
        //VERIFICATION QUANTITE > 100
        if (findCanap.quantity + +canapQuantity > 100) {
            alert('Quantité maximale de 100 pièces par produit')
            return
        }
        else {
            findCanap.quantity += +canapQuantity 
        }
    }
    else {
        storageArray.push({
            id: canapID,
            quantity: +canapQuantity,
            color: canapColor,
            price : canapPrice
        })
    }
    alert('Produit ajouter au panier !')
    localStorage.setItem('cart' ,JSON.stringify(storageArray))
}