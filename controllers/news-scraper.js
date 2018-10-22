var express = require("express");

var router = express.Router();

var news_scraper_service = require("../services/news-scraper-service.js");

const Article = require("../model/article.js");

router.get("/", function(req, res) {
    news_scraper_service.scrapeArticlesFromSource(function(articles) {
        var hbsObject = {
            articles: articles
        };
        res.render("index", hbsObject);
    });
});

router.post("/save-article", function(req, res) {
    let data = req.body;
    news_scraper_service.saveArticle(data.id, function(cb_res) {
        if(cb_res) {
            res.statusCode = 200;
            res.send({});
        } else {
            res.statusCode = 500;
            res.send({ message: "Could not save article"});
        }
    });
});

router.delete("/delete-article", function(req, res) {
    let data = req.body;
    news_scraper_service.removeSavedArticle(data.id, function(cb_res) {
        if(cb_res) {
            res.statusCode = 200;
            res.send({});
        } else {
            res.statusCode = 500;
            res.send({ message: "Could not delete article"});
        }
    })
});


router.get("/saved-articles", function(req, res) {
    news_scraper_service.getSavedArticles(function(savedArticles) {
        var hbsObject = {
            savedArticles: savedArticles
        };
        res.render("saved_articles", hbsObject);
    });
});

module.exports = router;
