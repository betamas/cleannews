const {TextAnalyticsClient, AzureKeyCredential} = require("@azure/ai-text-analytics");
const tf = require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const encoder = require('@tensorflow-models/universal-sentence-encoder');
const threshold = 0.5;
const labels = ['toxicity'];
const Build = require('newspaperjs').Build;
const Article = require('newspaperjs').Article;
const key = "46f07a0298244e4b929c7ec1473e42ab";
const endpoint = "https://newstext.cognitiveservices.azure.com/";
const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));
async function getText(url)
{
    let result = await Article(url);
    var text = result['text'].split(/\r?\n/);
    text = text.sort(function (a, b) { return b.length - a.length; })[0];
    return text;
}
async function getToxicity(sentence, model)
{
    let predictions = await model.classify(sentence);
    return predictions[0]['results'][0]['match'];
}
async function getEmbeddings(sentence, model)
{
    let embeddings = await model.embed(sentence);
    return embeddings;
}
async function cosineSimilarity(a, b)
{
    ans = (a.dot(b)).div((a.norm()).mul(b.norm()));
    let data = await ans.data();
    return data[0];
}
async function similarity(embeddings1, embeddings2)
{
    sumSim = 0;
    for (i = 0; i < embeddings1.shape[0]; i++)
    {
        maxSim = -1;
        for (j = 0; j < embeddings2.shape[0]; j++)
        {
            let curr = await cosineSimilarity(embeddings1.slice(i, [1, -1]).squeeze(), embeddings2.slice(j, [1, -1]).squeeze());
            maxSim = Math.max(maxSim, curr);
        }
        sumSim += maxSim;
    }
    return sumSim / embeddings1.shape[0];
}

async function test(textURL, model1, model2)
{
    let input = await getText(textURL);
    let documents = input.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
    // let currentChunk = ""
    // let chunks = []
    // for (i = 0; i < documents.length; i++)
    // {
    //     let possibleChunk = currentChunk + " " + documents[i];
    //     if (possibleChunk.length < 5000)
    //         currentChunk = possibleChunk;
    //     else
    //     {
    //         chunks.push(currentChunk);
    //         currentChunk = documents[i];
    //     }
    //     if (i == documents.length - 1)
    //         chunks.push(currentChunk);
    // }
    // // let sentimentResult = await client.analyzeSentiment(chunks);
    // // sentimentResult.forEach(document => {
    // //     console.log(`\tDocument Sentiment: ${document.sentiment}`);
    // //     console.log(`\tDocument Scores:`);
    // //     console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
    // // });
    sentenceEmbeddings = null;
    toxicityResult = false;
    sentencetox = new Array(documents.length);
    for (i = 0; i < documents.length; i++)
    {
        sentencetox[i] = await getToxicity(documents[i], model1);
    }
    if (sentencetox.includes(true))
    toxicityResult = true;
    
    for (i = 0; i < documents.length; i++)
    {
        if (sentenceEmbeddings === null)
            sentenceEmbeddings = await getEmbeddings(documents[i], model2);
        else
            sentenceEmbeddings = sentenceEmbeddings.concat(await getEmbeddings(documents[i], model2));
    }
    console.log(sentenceEmbeddings);
    return sentenceEmbeddings;
}
async function similarityTest(urls)
{
    console.time("test");
    let modelToxicity = await toxicity.load(threshold, labels);
    let modelEmbedding = await encoder.load();
    embs = new Array(urls.length);
    for (i = 0; i < urls.length; i++)
    {
        res = await test(urls[i], modelToxicity, modelEmbedding);
        embs[i] = res;
    }
    similarities = new Array(urls.length);
    for (i = 0; i < embs.length; i++)
    {
        avgSimilarity = 0
        for (j = 0; j < embs.length; j++)
        {
            if (i != j)
            {
                avgSimilarity += await similarity(embs[i], embs[j]);
            }
        }
        similarities[i] = avgSimilarity / embs.length - 1;
    }
    console.timeEnd("test");
}
urls = [
    'https://www.dailyexcelsior.com/many-political-activists-at-joining-function-of-jkap-in-pattan/',
    'https://yourstory.com/smbstory/india-usa-trade-msme-iacc-digital-skills',
    'https://www.theweek.in/news/world/2020/10/13/amid-political-turmoil-indian-origin-vp-nominee-kamala-harris-rising-stock.html',
    'https://www.thenewsminute.com/article/all-india-bar-association-seeks-contempt-action-against-cm-jagan-135563',
    'https://news.webindia123.com/news/Articles/India/20201017/3643691.html',
    'http://www.uniindia.com/~/late-rajmata-vijaya-raje-scindia-held-important-place-in-indian-politics-khattar/States/news/2197397.html',
    'https://scroll.in/latest/976001/j-k-p-chidambaram-welcomes-political-alliance-says-congress-stands-for-restoration-of-article-370',
    'https://swarajyamag.com/insta/all-india-bar-association-seeks-contempt-proceedings-against-andhra-cm-jagan-mohan-reddy',
    'https://www.thequint.com/news/india/ncp-becomes-first-political-party-to-form-an-lgbt-cell',
    'https://www.ndtv.com/india-news/secularism-not-safe-without-separation-of-religion-politics-sitaram-yechury-2311811',
    'https://in.news.yahoo.com/india-bar-association-demands-contempt-110927599.html',
    'https://www.hindustantimes.com/columns/chanakya-the-politics-of-delhi-s-air-pollution/story-BVxNS9CnnY8szQjLXffckL.html',
    'https://www.indiatvnews.com/news/india/ram-vilas-paswan-big-signature-in-indian-politics-nitish-kumar-fondly-remembers-ljp-founder-655472',
    'https://www.hindustantimes.com/columns/are-there-socialists-left-in-politics/story-iSI8tnYB3zqU5SSiCsYfdM.html',
    'https://www.bloombergquint.com/politics/govt-approves-14th-tranche-of-electoral-bonds-sale-closes-on-oct-28',
    'https://www.newindianexpress.com/opinions/2020/oct/07/no-parallel-to-pm-modis-unique-style-and-substance-in-indias-political-history-2206913.html',
    'https://www.dailypioneer.com/2020/state-editions/govt-allows-political-gatherings-for-by-polls.html',
    'https://www.freepressjournal.in/india/peace-and-tranquillity-along-lac-deeply-disturbed-impacting-india-china-ties-says-s-jaishankar',
    'https://www.thequint.com/us-nri-news/india-us-ties-of-low-priority-for-indian-american-voters-finds-survey',
    'https://scroll.in/article/975984/kashmir-has-a-new-political-alliance-to-fight-for-special-status-but-how-will-it-work',
    'https://www.telegraphindia.com/india/bihar-assembly-elections-2020-congress-targets-nitish-kumar-more-than-narendra-modi-in-poll-campaign/cid/1794954',
    'https://indianexpress.com/article/india/china-insists-indians-vacate-chushul-heights-india-says-clear-pangong-north-6758219/',
    'https://www.businesstoday.in/current/economy-politics/india-china-clashes-border-conflict-left-relationship-profoundly-disturbed-says-jaishankar/story/419212.html',
    'https://indianexpress.com/article/explained/india-gdp-bangladesh-gdp-indian-economy-6748867/',
    'http://www.radio.gov.pk/17-10-2020/political-leadership-of-liberated-territory-unanimous-on-kashmir-issue-freedom-from-india-masood',
    'https://www.livemint.com/news/india/ncp-sets-up-lgbt-cell-claims-to-be-first-such-indian-political-party-11601894111781.html',
    'https://www.moneycontrol.com/news/trends/current-affairs-trends/amit-shah-interview-from-india-china-face-off-to-tanishq-ad-row-home-minister-delves-into-a-range-of-issues-5976311.html',
    'https://www.newsx.com/world/border-clashes-left-sino-indian-relationship-profoundly-disturbed-eam-jaishankar.html',
    'https://in.news.yahoo.com/congress-against-one-india-akshay-052200974.html',
    'https://www.goodreturns.in/classroom/political-party-funding-how-and-where-to-buy-electoral-bonds-1168870.html',
    'https://theprint.in/opinion/indian-politics-hathras-rape-case-up-police-yogi-adityanath-congress-gandhi-family/517348/',
    'https://www.indiatvnews.com/news/world/joe-biden-kamala-harris-wish-hindus-indian-americans-navratri-us-presidential-elections-2020-657769',
    'https://www.msn.com/en-ae/news/other/letters-readers-discuss-politics-in-india-ipl-in-uae-and-more/ar-BB1a84p9',
    'https://theprint.in/national-interest/advani-brought-new-friends-modi-and-amit-shah-doing-ashwamedha-yagna/525272/',
    'https://www.dailypioneer.com/2020/state-editions/---win-win-situation-for-india---.html',
    'https://www.newindianexpress.com/nation/2020/oct/11/middlemen-brokers-and-commission-agents-powered-their-politics-pm-attacks-rivals-for-opposing-farm-2208862.html',
    'https://www.republicworld.com/india-news/politics/assam-cm-condoles-death-of-paswan-terms-him-stalwart-of-indian-politics.html',
    'https://www.thehansindia.com/news/national/seventh-round-of-corporations-commander-level-talks-between-india-and-china-to-begin-at-12-noon-650872',
    'https://www.republicworld.com/india-news/politics/rahul-gandhi-attacks-pm-modi-compares-air-india-one-to-jawans-non-bu.html',
    'https://www.deccanchronicle.com/opinion/columnists/141020/can-cms-help-india-set-up-political-alternative.html',
    'https://www.deccanherald.com/video/news/contributing-to-rise-of-africa-is-in-india-s-interest-903456.html',
    'https://indiaeducationdiary.in/india-and-its-south-asian-partners-must-re-imagine-regional-economic-cooperation-and-integration-smriti-irani/',
    'https://www.youthkiawaaz.com/2020/10/politics-has-seeped-into-inter-faith-marriage-to-ruin-secular-fabric/',
    'https://www.youthkiawaaz.com/2020/10/cinema-caste-and-elections-bihar/',
    'https://www.americanbazaaronline.com/2020/10/15/this-is-our-time-say-indian-americans-in-politics-442759/',
    'https://news.webindia123.com/news/Articles/India/20201003/3635872.html',
    'https://www.businesstoday.in/current/economy-politics/india-ranks-94th-in-global-hunger-index-falls-into-serious-category-under-5-mortality-rate/story/419215.html',
    'https://www.ndtv.com/india-news/congress-had-stepmotherly-attitude-towards-ladakh-for-70-years-g-kishan-reddy-2311747']
similarityTest(urls);
    

