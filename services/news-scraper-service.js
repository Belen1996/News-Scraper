var news_scraper_service = {

    scrapeArticlesFromSource: function(cb) { // TODO: Query news service for the articles
        cb([{id: 1, headline: "Headline 1", description: "Article 1", original_article: "http://www.google.com", notes: []},
            {id: 2, headline: "Headline 2", description: "Article 2", original_article: "http://www.yahoo.com", notes: []}]);
    }

}

module.exports = news_scraper_service;