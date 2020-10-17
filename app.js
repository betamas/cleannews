const express = require('express')
const app = express()
const pug = require('pug');
app.set('view engine', 'jade')
// app.set('views', './views')
// app.get('/', (req,res) => {
// res.render('input.pug');
// });
console.log('test');
// const request = require('request');


//////// Bing
// const subscriptionKey = `c7b9a2a0c02e448aa8092dc7dbd8dcca`;
// //const endpoint = 'https://eastus2.api.cognitive.microsoft.com/bing/v7.0/news/search';
// const endpoint = 'https://spot2.cognitiveservices.azure.com/bing/v7.0/news/search';

var newsList = [];
// app.get('/callback', function(req, res) {
// };

const articles = require('./main.js')

app.get('/', async function(req, res){

    function loadPage(newsList){
        console.log('load page');
        newsList.forEach(news=>{
            console.log(news.name);
        });
        res.render('input.pug', {'newsList': newsList});
        console.log('out');
    
    };
    articles.fetchArticles('india politics', 10).then(res => {
        console.log(res);
      loadPage(res)
    })
    .catch(function(err) {
        console.log('Unfortunately, something has gone wrong.', err.message);
    })
});




app.listen(3000, () => console.log("Listening on port 3000"));
