const sentiment = require('./sentiment.js')

const axios = require('axios')
const key = 'eee369f9e1e844028af31e527327ccb2'
const bing_url = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search?'
const fake_link = 'https://api.fakenewsdetector.org/votes?url='
const weights = [0.3, 0.2, 0.1, 0.2, 0.2]

module.exports.fetchArticles = (query, count) => {
    return new Promise((resolve, reject) => {
        axios({
            url: bing_url, 
            method: 'get', 
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': key,
            },
            params: {
                'q': (query),
                'count': count,
                'mkt': 'en-in',
                'safeSearch': 'Moderate'
            }
        })
        .then(result => {
            let links = result.data.value.map(obj => {
                let index = obj.url.indexOf('&')
                if (index !== -1) {
                    obj.url = obj.url.substring(0, index)
                }
                console.log(obj.url)
                return fakeNewsPromise(fake_link + obj.url + '&title=')
            })
            let sentiments = result.data.value.map(obj => {
                return sentiment.sentimentAnalysis(obj.url)
            })
            Promise.all(links).then((values) => {
                Promise.all(sentiments).then((sent_ratings) => {
                    let news = values.map((obj, idx) => {
                        obj['domain'] = result.data.value[idx].url
                        let pos = 0, neu = 0, neg = 0
                        sent_ratings[idx].documents.forEach(obj => {
                            pos += obj.confidenceScores.positive
                            neu += obj.confidenceScores.neutral
                            neg += obj.confidenceScores.negative
                        })
                        confidenceScores = { positive: (pos/sent_ratings[idx].documents.length), 
                            neutral: (neu/sent_ratings[idx].documents.length), negative: (neg/sent_ratings[idx].documents.length) }
                        obj['sentiments'] = confidenceScores
                        return obj
                    })
                    news.sort((a, b) => {
                        a_rating = a.robot.fake_news*weights[0] + a.robot.extremely_biased*weights[1] + a.robot.clickbait*weights[2] + a.sentiments.positive*weights[3] + a.sentiments.negative*weights[4]
                        b_rating = b.robot.fake_news*weights[0] + b.robot.extremely_biased*weights[1] + b.robot.clickbait*weights[2] + b.sentiments.positive*weights[3] + b.sentiments.negative*weights[4]
                        if (a_rating > b_rating) {
                            return 1
                        } else if (a_rating < b_rating) {
                            return -1
                        }
                        return 0
                    })
                    resolve(news)
                })
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
                    console.log(err)
                })
            });
        }
        
        })
}