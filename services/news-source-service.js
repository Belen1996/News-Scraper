const Article = require("../model/article.js");
const axios = require("axios");
const cheerio = require("cheerio");

// const isRunningInHeroku = (process.env.NODE && (process.env.NODE.indexOf("heroku") !== -1));

function getArticles(cb) {
    axios.get("https://www.theguardian.com/us")
    .then(function(response) {
        cb(extractArticles(response.data));
    }).catch(function(error) {
        console.log("Error accessing The Guardian (US Edition): " + error);
        cb([]);
    });
}

function extractArticles(html) {
    var result = [];
    let $ = cheerio.load(html);
    $(".fc-item__container").each( function (i, elem) {
        try{
            let article = $(this).find(".fc-item__content");
            let original_article = $(this).find('a[data-link-name="article"]').attr("href");
            let headline = article.find(".js-headline-text").text().trim();
            let description = article.find(".fc-item__standfirst").text().trim();
            result.push(new Article(null, headline, description, original_article));    
        } catch(e) {
        }
    });
    return result;
}

var news_source = {
    getArticles: getArticles
}

module.exports = news_source;