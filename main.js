const axios = require('axios')

axios({
    url: ('https://api.cognitive.microsoft.com/bing/v7.0/news/search?' + 'q=microsoft&count=10&mkt=en-us&safeSearch=Moderate'), 
    method: 'get', 
    headers: {
        'Content-Type': 'application/json',
        'Authorization': api_key,
    },
})
.then(result => {
    console.log(result.data)
    axios({
        url: 'https://api.fakenewsdetector.org/votes?url=https://www.nbcnews.com/think/opinion/trump-wants-another-october-surprise-his-efforts-manufacture-one-are-ncna1243493&title=', 
        method: 'get', 
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(result2 => {
        console.log(result2.data)
    })
    .catch(err => {
        console.log(err)
    })
})
.catch(err => {
    console.log(err)
})
