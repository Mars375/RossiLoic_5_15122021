// RECUPERATION DE ID DANS URL
const params = (new URL(document.location)).searchParams
const canapID = params.get('id'); // on récupère l'id du canapé

//EXECUTION DE MES FONCTIONS
document.addEventListener('DOMContentLoaded', async () => {

//RECUPERATION DU CANAPE
    const response = await fetch('http://localhost:3000/api/products/' +canapID)
    const data = await response.json()    

//AJOUT INFOS CANAPE
    document.getElementById('title').innerHTML = data.name
    document.getElementById('price').innerHTML = data.price
    document.getElementById('description').innerHTML = data.description
    addOption(data)
    addImg(data)

//AJOUT AU PANIER
    var click = document.getElementById("addToCart");
    click.onclick = addCart
})

//AJOUTS DES OPTIONS DE COULEURS
function addOption(data) {

    const colors = document.getElementById('colors')

    data.colors.forEach (option => {
        const newOption = document.createElement('option')
        const newContent = document.createTextNode(option)
        newOption.value = option
        newOption.appendChild(newContent)
        colors.appendChild(newOption)
    })
}

//AJOUT IMAGE
function addImg(data) {

    const image = document.querySelector('.item__img')    
    const newImg = document.createElement('img')
    
    newImg.src = data.imageUrl
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