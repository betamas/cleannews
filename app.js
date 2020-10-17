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

const axios = require('axios')
const key = 'eee369f9e1e844028af31e527327ccb2'


app.get('/', async function(req, res){
    console.log('pew pew');
    var newsList = [];
    function getInfo(callback){
        axios({
            url: ('https://api.cognitive.microsoft.com/bing/v7.0/news/search?'), 
            method: 'get', 
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': key,
            },
            params: {
                'q': 'india politics',
                'count': 10,
                'mkt': 'en-IN',
                'safeSearch': 'Moderate'
            }
        })
        .then(result => {
            console.log(result.data);
            // newsList = result.data['value'];
            // newsList = JSON.stringify(newsList);
            // newsList.push(body.value[0]);
            console.log('body');
            console.log(result.data.value);
            for(var i = 0; i<10; i++){
                // newsList.push(JSON.stringify(result.data.value[i]));
                newsList.push(result.data.value[i]);
                console.log('beep '+i);
                console.log(result.data.value[i]);
            }
            // newsList = result.data.value;
            loadPage(newsList);
        })
        .catch(function(err) {
            console.log('Unfortunately, something has gone wrong.', err.message);
        });
    }

    function loadPage(newsList){
        console.log('load page');
        newsList.forEach(news=>{
            console.log(news.name);
        });
        res.render('input.pug', {'newsList': newsList});
        console.log('out');
    
    };
    getInfo(loadPage);
    console.log('after get info');
    // loadPage(newslist);
    console.log('after load page');
});




app.listen(3000, () => console.log("Listening on port 3000"));
