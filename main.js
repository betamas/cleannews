const axios = require('axios')
const key = 'eee369f9e1e844028af31e527327ccb2'
const bing_url = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search?'
const fake_link = 'https://api.fakenewsdetector.org/votes?url='
const weights = [0.45, 0.35, 0.2]

axios({
    url: bing_url, 
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
    let links = result.data.value.map(obj => {
        return fakeNewsPromise(fake_link + obj.url + '&title=')
    })
    Promise.all(links).then((values) => {
        let news = values.map((obj, idx) => {
            obj['domain'] = result.data.value[idx].url
            return obj
        })
        news.sort((a, b) => {
            a_rating = a.robot.fake_news*weights[0] + a.robot.extremely_biased*weights[1] + a.robot.clickbait*weights[2]
            b_rating = b.robot.fake_news*weights[0] + b.robot.extremely_biased*weights[1] + b.robot.clickbait*weights[2]
            if (a_rating > b_rating) {
                return 1
            } else if (a_rating < b_rating) {
                return -1
            }
            return 0
        })
        console.log(news)
    })
    .catch((err) => {
        console.log(err)
    })
})
.catch(err => {
    console.log(err)
})

fakeNewsPromise = (link) => {
    return new Promise((resolve, reject) => {
        axios({
            url: link, 
            method: 'get', 
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(result => {
            resolve(result.data)
        })
        .catch(err => {
            console.err(err)
        })
    });
}
