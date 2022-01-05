//EXECUTION DE MES FONCTIONS
document.addEventListener('DOMContentLoaded', () => {
  //URL API
  const apiUrl = 'http://localhost:3000/api/products'

  //RECUPERATION DE ID ITEMS DE HTML
  const items = document.getElementById('items')

  //APPEL API AVEC FETCH
  fetch(apiUrl)
    .then(response => response.json())  
    .then(productArray => {
      // boucle foreach parcours tous les produits de la liste
      productArray.forEach(product => {
        createKanap(product)
        localStorage.setItem(product._id, JSON.stringify(product))
      })
    })
    .catch(err => {
      console.error(err)
      items.setAttribute("style", "color:red")
      items.innerHTML +=`
        <h3 class="productName">Une erreur est survenue</h3>
      `
      return
    })

//  FONCTION AFFICHAGE HTML
  function createKanap(canape) {
      items.innerHTML +=`
            <a href="./product.html?id=${canape._id}">
              <article>
                <img src=${canape.imageUrl} alt=${canape.altTxt}>
                <h3 class="productName">${canape.name}</h3>
                <p class="productDescription">${canape.description}</p>
              </article>
            </a>`
  }
})