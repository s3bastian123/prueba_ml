const url = 'http://localhost:3010/api/itemsq=';
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
    result = response.items;
    result.length >4 ? result= result.slice(0,4) : '';
    let infoItem=0,breadCrumb='',box='';
    response.categories.length ? 
        response.categories.forEach((item, index)=>{
            index==0 ? breadCrumb = item : breadCrumb += ' > '+item;
        }) : '';
    result.forEach((item, index) => {
        let formaty =new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0
        }),
        free_ship='';
        item.free_shipping==true ? free_ship = '<div class="item-free"></div>' : '';
        box =  `
        <a class="item" data-id="${item.id}" href="/items/${item.id}" target="_self">
            <div class="item-img">
                <img src="${item.picture}" alt="${item.title}">
            </div>
            <div class="item-info">
                <div class="item-price">$ ${formaty.format(item.price.amount)} ${free_ship}</div>
                <div class="item-title">${item.title}</div>
            </div>
            <div class="item-state">${item.state}</div>
        </a>`;
        index==0? infoItem = box : infoItem += box;
    });
    document.getElementById('items-result').innerHTML= infoItem;
    document.getElementById('bread-crumb').innerHTML= breadCrumb;
    
});