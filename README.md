# cleannews


## Motivation
* Now, more than ever, low quality news and misinformation is a problem
* Large amounts of political distress and unrest within India (the selected country for this demo)
* Many media outlets are either state sponsored with high biases or extremely critical
* Other issues include hate speech, clickbait, and fake news
* We want to eliminate these issues while maintaining a usable news experience

## Utility
* Combination of clean and informative
* Title, News Source, Date, Summary, Image
* Probabilities of fake news, excessive bias, and clickbait
* Detailed sentiment analysis
* Keywords

## Process
* First we pull our news articles using the Azure News API
* Articles written by India-based publications are prioritized over articles from foreign countries about India
* All articles + their content are analyzed by our ranking and filtering algorithms
* Finally, our Pug frontend dynamically modifies our page based on our analysis and content changes

## Ranking Algorithm
* We first calculate the fake news(h), excessive bias(b), and clickbait(c) probabilities using pretrained models and our hate speech index(o) using Tensorflow
* Then we use a weighted mean to derive our rankings of our news articles

## Filtering
* Sentiment analysis is run using Azure on all article content to help contextualize articles to users
* ML-based article similarity detection using Tensorflow to bring diverse views and articles to the user’s fingertips
* Any articles where all three key probabilities are greater than 50% are flagged as low-quality and removed
* All other articles have their Windows indicators updated accordingly based on their statistics
