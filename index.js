const express = require('express')
const bodyParser = require('body-parser')

const https = require('https')
let dataQuery = '';

const path = require('path')
const app = express()
const port = process.env.PORT || 3010

let queryR = '';

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

//init server
app.listen(port, () => {
  console.log(`Mercadolibre app listening at http://localhost:${port}`)

})

//get home
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'src/search.html'))
});

//go to search results fromm search results
app.post('/', (req, res) => {
    dataQuery = req.body.search
    res.redirect('/api/items?search='+dataQuery)
    res.end()
})
//go to search results fromm search results
app.post('/api/items/', function (req, res, next) {
    dataQuery = req.body.search
    res.redirect('/api/items?search='+dataQuery)
    res.end()
});

//go to search results fromm item detail
app.post('/api/items/*', function (req, res, next) {
    dataQuery = req.body.search
    res.redirect('/api/items?search='+dataQuery)
    res.end()
});

app.get('/api/items', (req, res) =>{
    getServiceSearch(dataQuery);
    res.status(200).sendFile(path.resolve(__dirname, 'src/items.html'))
    //res.status(200).send(getServiceSearch(dataQuery))
})

app.get('/api/items/*', function(req, res){
    res.sendFile(path.resolve(__dirname, 'src/item.html'))
})

//routes js
app.get('/src/js/showItems.js', (req, res) =>{

    res.status(200).sendFile(path.resolve(__dirname, 'src/js/showItems.js'))
})

app.get('/src/js/showItem.js', (req, res) =>{

    res.status(200).sendFile(path.resolve(__dirname, 'src/js/showItem.js'))
})

function getServiceSearch(parametter){
   https.get('https://api.mercadolibre.com/sites/MLA/search?q=:'+parametter, (resp) => {
      let data = '';
    
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
          queryR = {
              "author":{
                  "name": "Juan Sebastián",
                  "lastname": "López Roncancio"
              },
              "categories": [],
              "items": []
          }
          data = JSON.parse(data);
        data.filters.forEach(filter => {
            filter.values.forEach(category =>{
                queryR.categories.push(category.name)
                queryR.categories.push(category.path_from_root[0].name)
            })
        });
        if(data.results.length>4){
            data.results = data.results.slice(0,4);
        }
        data.results.forEach(item =>{
            let n =  Number(item.price),
                decimal;
            n = Math.abs(n);
            decimal = n - Math.floor(n)
            if(decimal == 0){
                decimal = 00
            }
            queryR.items.push({
                "id": item.id,
                "title":item.title,
                "price":{"currency":item.currency_id, "amount": Number(Math.floor(item.price)), "decimal": decimal},
                "picture": item.thumbnail,
                "condition": item.condition,
                "free_shipping": item.shipping.free_shipping
            })
        })
        return queryR;
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}