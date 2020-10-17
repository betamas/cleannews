const express = require('express')
const app = express()
const pug = require('pug');
app.set('view engine', 'jade')
// app.set('views', './views')
// app.get('/', (req,res) => {
// res.render('input.pug');
// });
console.log('test');
const request = require('request');


//////// Bing
const subscriptionKey = `c7b9a2a0c02e448aa8092dc7dbd8dcca`;
//const endpoint = 'https://eastus2.api.cognitive.microsoft.com/bing/v7.0/news/search';
const endpoint = 'https://spot2.cognitiveservices.azure.com/bing/v7.0/news/search';

var newsList = [];
// app.get('/callback', function(req, res) {
// };


app.get('/', async function(req, res){
    //should be picking up the auth credentials here
    console.log('asdf');
    
  
    //spotify get tracks
    var tracklist = [];
    var finished = false;
    function getInfo(tracklist){
        console.log('next function');
  
        let query = "";
        let mkt = 'en-US';
        let request_params = {
          method: 'GET',
          uri: endpoint,
          headers: {
              'Ocp-Apim-Subscription-Key': subscriptionKey
          },
          qs: {
              q: query,
              mkt: mkt,
              sortby: 'date'
          },
          json: true,
          
        };
      
        var newsList = [];
        var count = 0;


        
        query = 'india politics';
        request_params.qs.q = query;
        request(request_params, async function (error, response, body) {
        console.error('error:', error)
        console.log('statusCode:', response && response.statusCode)
        //console.log('original query: ' + body.queryContext.originalQuery)
        if(response.statusCode != 200){
            console.log('not 200');
            console.log(response.statusMessage);
            count++;
        }
        else if(!error && response && body && body != null){
            console.log();
            console.log(artist);
            console.log(body.value[0]);
            newsList.push(body.value[0]);
            console.log(newsList.length);
            count++;
            if(count == tracklist.length){
            callback(newsList);
            return;
            }
        }
        else{
            console.log('issue');
        }
        await new Promise(r => setTimeout(r, 1000));
        });
          //   .catch(function(err) {
          //   console.log('Unfortunately, something has gone wrong.', err.message);
          // });

        console.log('done with loop');
        //callback(newsList);
        console.log(newsList);
        
        // .then(function(newsList){
        //   console.log('returning newslist');
        //   return newsList
        // });
      }).catch(function(err) {
        console.log('Unfortunately, something has gone wrong.', err.message);
      });
      
      
    };
  
    function loadPage(newsList){
      console.log('next next function');
    
  
      // change the next line back to undupList
      res.render('hands', {'handList': newsList});
      console.log('out');
  
    };
  
  
    getInfo(loadPage);
    loadPage(tempList);
    
    //query += '&sortBy=Date';
    
   
  
    
  
  
  
    
    
  
  
});
app.listen(3000, () => console.log("Listening on port 3000"));
