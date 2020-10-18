const tf = require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const encoder = require('@tensorflow-models/universal-sentence-encoder');
const threshold = 0.5;
const labels = ['toxicity'];
const Build = require('newspaperjs').Build;
const Article = require('newspaperjs').Article;

function getToxicity(sentence, model)
{
    return new Promise((resolve, reject) => {
        model.classify(sentence).then(predictions => {
            resolve(predictions[0]['results'][0]['match'])
        }).catch(reason=>{
            console.log(reason);
        })
    })
}

module.exports.test = (textURL) =>
{
    console.log(textURL)
    return new Promise((resolve, reject) => {
        Article(textURL).then(result1 => {
            var text = result1['text'].split(/\r?\n/);
            text = text.sort(function (a, b) { return b.length - a.length; })[0];
            let documents = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
            sentenceEmbeddings = null;
            toxicityResult = false;
            toxicity.load(threshold, labels).then(modelToxicity => {
                sentencetox = new Array(documents.length);
                for (i = 0; i < documents.length; i++)
                {
                    sentencetox[i] = getToxicity(documents[i], modelToxicity);
                }
                Promise.all(sentencetox).then((values) => {
                    if (values.includes(true)) toxicityResult = true;
                    resolve(toxicityResult)
                }).catch(reason=>{
                    console.log(reason);
                })
            }).catch(reason=>{
                console.log(reason);
            })
        }).catch(reason=>{
                console.log(reason);
            })
    })
    
}
