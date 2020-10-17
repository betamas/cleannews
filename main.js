const axios = require('axios')
const key = 'eee369f9e1e844028af31e527327ccb2'

axios({
    url: ('https://api.cognitive.microsoft.com/bing/v7.0/news/search?'), 
    method: 'get', 
    headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': key,
    },
    params: {
        'q': 'microsoft',
        'count': 10,
        'mkt': 'en-us',
        'safeSearch': 'Moderate'
    }
})
.then(result => {
    console.log(result.data)
    /*
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
    })*/
})
.catch(err => {
    console.log(err)
})
