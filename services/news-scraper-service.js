var news_source = require("./news-source-service.js");
var db = require("./news-scraper-db.js");

function scrapeArticlesFromSource(source){
    return function (cb) {
        cb(source.getArticles());
    }
}

function saveArticle(db) {
    return function(article, cb) {
        db.saveArticle(article, function(res) {
            cb(res);
        });
    }
}

function removeSavedArticle(db) {
    return function(article, cb) {
        db.removeSavedArticle(article, function(res) {
            cb(res);
        });
    }
}

function getSavedArticles(db) {
    return function(cb) {
        db.getSavedArticles(cb);
    }
}

function clearSavedArticles(db) {
    return function() {
        db.clearSavedArticles();
    }
}

var news_scraper_service = {
    scrapeArticlesFromSource: scrapeArticlesFromSource(news_source),
    saveArticle: saveArticle(db),
    removeSavedArticle: removeSavedArticle(db),
    getSavedArticles: getSavedArticles(db),
    clearSavedArticles: clearSavedArticles(db)
}

module.exports = news_scraper_service;