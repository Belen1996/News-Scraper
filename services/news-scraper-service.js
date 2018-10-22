var news_source = require("./news-source-service.js");
var db = require("./news-scraper-db.js");

function scrapeArticlesFromSource(source, db){
    return function (cb) {
        source.getArticles(function(articles) {
            db.storeDisplayedArticles(articles, function(cbRes) {
                db.getDisplayedArticles(function(displayed_articles) {
                    cb(displayed_articles);
                });
            });    
        });
    }
}

function saveArticle(db) {
    return function(id, cb) {
        db.saveArticle(id, function(res) {
            cb(res);
        });
    }
}

function removeSavedArticle(db) {
    return function(id, cb) {
        db.removeSavedArticle(id, function(res) {
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

function getCommentsFromArticle(db) {
    return function(article_id, cb) {
        db.getNotes(article_id, cb);
    }
}

function saveCommentForArticle(db) {
    return function(article_id, note, cb) {
        db.saveNote(article_id, note, cb);
    }
}

function removeCommentFromArticle(db) {
    return function(article_id, note_id, cb) {
        db.removeNote(article_id, note_id, cb);
    }
}

var news_scraper_service = {
    scrapeArticlesFromSource: scrapeArticlesFromSource(news_source, db),
    saveArticle: saveArticle(db),
    removeSavedArticle: removeSavedArticle(db),
    getSavedArticles: getSavedArticles(db),
    clearSavedArticles: clearSavedArticles(db),
    getCommentsFromArticle: getCommentsFromArticle(db),
    saveCommentForArticle: saveCommentForArticle(db),
    removeCommentFromArticle: removeCommentFromArticle(db)
}

module.exports = news_scraper_service;