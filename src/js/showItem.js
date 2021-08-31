const url = 'http://localhost:3010/api/items/';
let myQuery = window.location.pathname.split("items/"),
    result;
myQuery = myQuery[1];
console.log(myQuery)
fetch(url+myQuery, {
  method: 'GET',
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => {
    result = response.item;
    result.condition=="new" ? result.condition = 'Nuevo' : result.condition = 'Usado';
    let n =  Number(result.price),
        formaty =new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0
        });
        n = Math.abs(n);
        console.log(result);
    document.getElementById('resultado-item').innerHTML = `
    <div class="product-img">
        <img src="${result.picture}" alt="${result.title}">
    </div>
    <div class="product-info">
        <span class="product-condition">${result.condition}</span>
        <span class="product-sold">- ${result.sold_quantity} vendidos</span>
        <h3 class="product-title">${result.title}</h3>
        <div class="product-price"><div class="product-int">$ ${formaty.format(result.price.amount)}</div><div class="product-decimal">${result.price.decimals}</div></div>
        <a href="" class="product-buy">Comprar</a>
    </div>`;
    document.getElementById('description-item').innerHTML = `<div class="product-dTitle">Descripción del producto</div><div class="product-description">${result.description}</div>`
})