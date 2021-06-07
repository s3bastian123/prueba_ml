//document.getElementById('resultado').innerHTML = "ufff";
const url = 'https://api.mercadolibre.com/sites/MLA/search?q=:';
let myQuery = window.location.search.split("="),
    result;
myQuery = myQuery[1];
document.getElementById("inputR").value = myQuery;
fetch(url+myQuery, {
  method: 'GET',
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
.catch(error => console.error('Error:', error))
.then(response => {
    result = response.results;
    if (result.length >4){
        result= result.slice(0,4);
    }
    let infoItem,breadCrumb;
    breadCrumb = response.filters[0].values[0].name+' > '+response.filters[0].values[0].path_from_root[0].name;
    result.forEach((item, index) => {
        let formaty =new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0
        }),
        free_ship='';
        if(item.shipping.free_shipping==true){
            free_ship = '<div class="item-free"></div>';
        }
        if(index==0){
            infoItem = `
        <a class="item" data-id="${item.id}" href="/api/items/${item.id}" target="_self">
            <div class="item-img">
                <img src="${item.thumbnail}" alt="${item.title}">
            </div>
            <div class="item-info">
                <div class="item-price">$ ${formaty.format(item.price)}</div>
                <div class="item-title">${item.title}</div>
            </div>
            <div class="item-state">${item.address.state_name}</div>
        </a>`;
        }else{
            infoItem += ` 
            <a class="item" data-id="${item.id}" href="/api/items/${item.id}" target="_self">
                <div class="item-img">
                    <img src="${item.thumbnail}" alt="${item.title}">
                </div>
                <div class="item-info">
                    <div class="item-price">$ ${formaty.format(item.price)} ${free_ship}</div>
                    <div class="item-title">${item.title}</div>
                </div>
                <div class="item-state">${item.address.state_name}</div>
            </a>`
        }
    });
    document.getElementById('items-result').innerHTML= infoItem;
    document.getElementById('bread-crumb').innerHTML= breadCrumb;
    
});