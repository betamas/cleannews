const axios = require('axios')
const Article = require('newspaperjs').Article
const url = 'https://newstext.cognitiveservices.azure.com/text/analytics/v3.0/keyPhrases'
const text_url = 'https://www.nbcnews.com/think/opinion/trump-wants-another-october-surprise-his-efforts-manufacture-one-are-ncna1243493'
const key = '46f07a0298244e4b929c7ec1473e42ab'


Article(text_url)
.then(result1=>{
    var text = result1['text'].split(/\r?\n/);
    text = text.sort(function (a, b) { return b.length - a.length; })[0];
    var documents = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")
    var currentChunk = ""
    console.log(documents.length)
    var chunks = []
    for (i = 0; i < documents.length; i++)
    {
        var possibleChunk = currentChunk + " " + documents[i];
        if (possibleChunk.length < 5000)
            currentChunk = possibleChunk;
        else
        {
            chunks.push(currentChunk);
            currentChunk = documents[i];
        }
        if (i == documents.length - 1)
            chunks.push(currentChunk);
    }
    var sentimentInput = []
    for (i = 0; i < chunks.length; i++)
    {
        sentimentInput.push({
            text: chunks[i],
            id: i.toString(),
            language: "en"
        });
    }

    axios({
        url: url, 
        method: 'post', 
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': key,
        },
        data: {
            "documents": sentimentInput,
        }
    })
    .then(result2 => {
        console.log(result2.data.documents[0].keyPhrases)
    }).catch(err => {
        console.log(err)
    })

}).catch(reason=>{
    console.log(reason);
})