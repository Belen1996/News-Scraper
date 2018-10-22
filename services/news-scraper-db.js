var db_simulation = [];

function articleAlreadyExists(articles, article) {
    if(!articles || !article) {
        return false;
    } else {
        return (articles.filter(a => a.id === article.id).length > 0);
    }
}

function saveArticle(article, cb) {
    if(article) {
        let res = !(articleAlreadyExists(db_simulation, article));
        if(res) {
            db_simulation.push(article);
        } else {
            removeSavedArticle(article, function(r) {
                if(r) {
                    db_simulation.push(article);
                    cb(true);
                }
            });
        }
        cb(res);
    } else {
        cb(false);
    }
}

function getSavedArticles(cb) {
    cb(db_simulation.slice());
}

function clearSavedArticles() {
    db_simulation = [];
}

function removeSavedArticle(article, cb) {
    let res = articleAlreadyExists(db_simulation, article);
    if(res) {
        var found = false;
        var index = 0;
        while(!found && (index < db_simulation.length)) {
            found = (db_simulation[index].id === article.id);
            if(!found) {
                index++;
            }
        }
        db_simulation = db_simulation.slice(0, index).concat(db_simulation.slice(index + 1, db_simulation.length)); 
    }
    cb(res);
}

var news_scraper_db = {
    saveArticle: saveArticle,
    getSavedArticles: getSavedArticles,
    clearSavedArticles: clearSavedArticles,
    removeSavedArticle: removeSavedArticle 
}

module.exports = news_scraper_db;