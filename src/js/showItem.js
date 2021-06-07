//document.getElementById('resultado').innerHTML = "ufff";
const url = 'https://api.mercadolibre.com/items/';
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
    result = response;
    if(result.condition=="new"){
        result.condition = 'Nuevo' 
    }else{
        result.condition = 'Usado'
    }
    let n =  Number(result.price),
            decimal,
            formaty =new Intl.NumberFormat('de-DE', {
                minimumFractionDigits: 0
            });
            n = Math.abs(n);
            decimal = n - Math.floor(n)
            if(decimal == 0){
                decimal = "00"
            }
    document.getElementById('resultado-item').innerHTML = `
    <div class="product-img">
        <img src="${result.pictures[0].secure_url}" alt="${result.title}">
    </div>
    <div class="product-info">
        <span class="product-condition">${result.condition}</span>
        <span class="product-sold">- ${result.sold_quantity} vendidos</span>
        <h3 class="product-title">${result.title}</h3>
        <div class="product-price"><div class="product-int">$ ${formaty.format(result.price)}</div><div class="product-decimal">${decimal}</div></div>
        <a href="" class="product-buy">Comprar</a>
    </div>`
})

fetch(url+myQuery+'/description', {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json'
    }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => {
    result = response;
    console.log(result.plain_text)
    document.getElementById('description-item').innerHTML = `<div class="product-dTitle">Descripción del producto</div><div class="product-description">${result.plain_text}</div>`
})