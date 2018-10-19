var express = require("express");

var router = express.Router();

var news_scraper_service = require("../services/news-scraper-service.js");

router.get("/", function(req, res) {
    news_scraper_service.scrapeArticlesFromSource(function(articles) {
        var hbsObject = {
            articles: articles
        };
        res.render("index", hbsObject);
    });
});

module.exports = router;
