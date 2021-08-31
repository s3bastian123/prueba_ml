const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const requesto = require('request');
const async = require('async');
const port = process.env.PORT || 3010

let dataQuery = '', queryR = '', desc='';
const escapeQ = unescape('%3F');

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
// search endpoint
app.get('/api/items?q=:name', (req, res) => {
    async.times(1, (i, callback) => {
        var options = {
            url: `https://api.mercadolibre.com/sites/MLA/search?q=${req.params.name}`
        } 
        requesto(options, (error, response, body) => {
            var result = JSON.parse(body);
            let nResults =[],
                maxResult= '';
            queryR = {
                "author":{
                    "name": "Juan Sebastián",
                    "lastname": "López Roncancio"
                },
                "categories": [],
                "items": []
            }
            var data = result;
            !data.filters.length?
                (queryR.categories = data.available_filters.filter(filter => filter.id == 'category'),
                queryR.categories = queryR.categories[0],
                queryR.categories.values.forEach(r =>{
                    nResults.push(r.results);
                }),
                maxResult = Math.max(...nResults),
                queryR.categories = queryR.categories.values.filter(filter => filter.results == maxResult),
                nResults = queryR.categories[0].name,
                queryR.categories = [],
                queryR.categories.push(nResults))
                :
                data.filters.forEach(filter =>{
                    filter.id == 'category'?
                        filter.values[0].path_from_root.forEach(category =>{
                            queryR.categories.push(category.name);
                        }): ''
                })
            data.results.length>4 ? data.results = data.results.slice(0,4): '';
            data.results.forEach(item =>{
                let n =  Number(item.price),
                    decimal;
                n = Math.abs(n);
                decimal = n - Math.floor(n)
                decimal == 0 ? decimal = 00 : '';
                queryR.items.push({
                    "id": item.id,
                    "title":item.title,
                    "price":{"currency":item.currency_id, "amount": Number(Math.floor(item.price)), "decimal": decimal},
                    "picture": item.thumbnail,
                    "condition": item.condition,
                    "state": item.address.state_name,
                    "free_shipping": item.shipping.free_shipping
                })
            })
            callback(null, data);
        });
        }, (err, results) => {
            /*res.redirect(req.route.path)*/
            res.json(queryR);
        });
});
//item endpoint
app.get('/api/items/:name', (req, res) => {
        async.parallel({
            one: (callback) => {
                var options = {
                    url: `https://api.mercadolibre.com/items/${req.params.name}`
                } 
                requesto(options, (error, response, body)=> {
                    var result = JSON.parse(body);
                    queryR = {
                        "author":{
                            "name": "Juan Sebastián",
                            "lastname": "López Roncancio"
                        },
                        "item": {
                            "id": result.id,
                            "title": result.title,
                            "price": {
                                "currency": result.currency_id,
                                "amount": Math.floor(result.base_price),
                                "decimals": (result.base_price - Math.floor(result.base_price)).toFixed(2)
                            },
                            "picture": result.pictures[0].url,
                            "condition": result.condition,
                            "free_shipping": result.shipping.free_shipping,
                            "sold_quantity": result.sold_quantity
                        }
                    };
                    queryR.item.price.decimals = String(queryR.item.price.decimals).slice(2, queryR.item.price.decimals.length);
                    callback(null, result);
                });
            },
            two: (callback) => {
                var options = {
                    url: `https://api.mercadolibre.com/items/${req.params.name}/description`
                } 
                requesto(options, (error, response, body)=> {
                    var result = JSON.parse(body);
                    desc = result.plain_text;
                    callback(null, result);
                });
            }
        }, (err, results)=> {
            queryR.item.description = desc;
            res.json(queryR);
        });
});

//go to search results fromm search results
app.post('/', (req, res) => {
    dataQuery = req.body.search
    res.redirect('/items?search='+dataQuery)
    res.end()
})
//go to search results fromm search results
app.post('/items/', function (req, res, next) {
    dataQuery = req.body.search
    res.redirect('/items?search='+dataQuery)
    res.end()
});

//go to search results fromm item detail
app.post('/items/*', function (req, res, next) {
    dataQuery = req.body.search
    res.redirect('/items?search='+dataQuery)
    res.end()
});

app.get('/items', (req, res) =>{
    res.status(200).sendFile(path.resolve(__dirname, 'src/items.html'))
})

app.get('/items/*', function(req, res){
    res.sendFile(path.resolve(__dirname, 'src/item.html'))
})

//routes js
app.get('/src/js/showItems.js', (req, res) =>{
    res.status(200).sendFile(path.resolve(__dirname, 'src/js/showItems.js'))
})

app.get('/src/js/showItem.js', (req, res) =>{
    res.status(200).sendFile(path.resolve(__dirname, 'src/js/showItem.js'))
})