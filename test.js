const {TextAnalyticsClient, AzureKeyCredential} = require("@azure/ai-text-analytics");
const Build = require('newspaperjs').Build;
const Article = require('newspaperjs').Article;
const key = "46f07a0298244e4b929c7ec1473e42ab";
const endpoint = "https://newstext.cognitiveservices.azure.com/";
const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

function filterX(string) {
    newArr = [...string];
    retArr = []
     for (var i = 0; i < newArr.length; i++) {
      if ((newArr[i] <= "z" && newArr[i] >= "a") || (newArr[i] <= "Z" && newArr[i] >= "A") || (newArr[i] === ' ')) {
        retArr.push(newArr[i]);     
      }
     }
     return retArr.join('');
    }

function getText(url)
{
return Article(url)
.then(result=>{
    var text = result['text'].split(/\r?\n/);
    text = text.sort(function (a, b) { return b.length - a.length; })[0];
    return text;

}).catch(reason=>{
    console.log(reason);
});
}
async function test(url)
{
    var input = await getText(url);
    const sentimentInput = 
    [{
        text: input,
        id: "0",
        language: "en"
    }];
    input = filterX(input)
    console.log(input)
    var sentimentResult = await client.analyzeSentiment(sentimentInput);
    sentimentResult.forEach(document => {
        console.log(`ID: ${document.id}`);
        console.log(`\tDocument Sentiment: ${document.sentiment}`);
        console.log(`\tDocument Scores:`);
        console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
        
    });
}
test("https://www.nbcnews.com/think/opinion/trump-wants-another-october-surprise-his-efforts-manufacture-one-are-ncna1243493");