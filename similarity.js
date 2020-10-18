

async function similarityTest(urls)
{
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