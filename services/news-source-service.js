const Article = require("../model/article.js");

function getArticles() {
    return [new Article("Headline 1", "Article 1", "https://www.google.com", []), new Article("Headline 2", "Article 2", "https://www.yahoo.com", [])];
}

var news_source = {
    getArticles: getArticles
}

module.exports = news_source;