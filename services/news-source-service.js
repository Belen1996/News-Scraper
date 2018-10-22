const Article = require("../model/article.js");

function getArticles(cb) {
    cb([new Article(null, "Headline 1", "Article 1", "https://www.google.com", []), new Article(null, "Headline 2", "Article 2", "https://www.yahoo.com", [])]);
}

var news_source = {
    getArticles: getArticles
}

module.exports = news_source;