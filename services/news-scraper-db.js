var displayed_articles = [];
var saved_articles = [];



// var mongoose = require('mongoose');

// var mongoDB =
//     process.env.MONGOLAB_URI ||
//     process.env.MONGOHQ_URL ||
//     'mongodb://localhost/HelloMongoose';
    
// mongoose.connect(mongoDB);

// mongoose.Promise = global.Promise;
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function articleAlreadyExists(articles, id) {
    if(!articles || !id) {
        return false;
    } else {
        return (articles.filter(a => a.id === id).length > 0);
    }
}

function saveArticle(id, cb) {
    if(id) {
        let res = !(articleAlreadyExists(saved_articles.map(sa => sa.article), id));
        if(res) {
            let found_articles = displayed_articles.filter(a => a.id === id);
            if(found_articles.length > 0) {
                let article = found_articles[0];
                displayed_articles = displayed_articles.filter(a => a.id !== id);
                saved_articles.push({article: article, notes: [] });
            } else {
                cb(false);
            }
        } else {
            cb(false);
        }
        cb(res);
    } else {
        cb(false);
    }
}

function getSavedArticles(cb) {
    cb(saved_articles.map(sa => sa.article).slice());
}

function getDisplayedArticles(cb) {
    cb(displayed_articles.slice());
}

function clearSavedArticles() {
    saved_articles = [];
}

function removeSavedArticle(id, cb) {
    let res = articleAlreadyExists(saved_articles.map(sa => sa.article), id);
    if(res) {
        let article = saved_articles.map(sa => sa.article).filter(a => a.id === id)[0];
        saved_articles = saved_articles.filter(sa => sa.article.id !== id);
        displayed_articles.push(article); 
    }
    cb(res);
}

function storeDisplayedArticles(articles, cb) {
    if(articles && articles.length > 0) {
        let currently_saved_articles = saved_articles.map(sa => sa.article);
        articles.forEach(article => {
            if(!articleAlreadyExists(displayed_articles.concat(currently_saved_articles), article.id)) {
                displayed_articles.push(article);
            }
        });
        cb(true);
    } else {
        cb(false);
    }
}

function noteAlreadyExists(notes, note_id) {
    return notes && note_id && (notes.filter(n => n.id === note_id).length > 0);
}

function saveNote(article_id, note, cb) {
    if(articleAlreadyExists(saved_articles.map(sa => sa.article), article_id) && 
       note && !noteAlreadyExists(saved_articles.map(sa => sa.notes), note.id)) {
        let entry = saved_articles.filter(sa => sa.article.id === article_id)[0];
        entry.notes.push(note);
        cb(true);
    } else {
        cb(false);
    }
}

function getNotes(article_id, cb) {
    if(articleAlreadyExists(saved_articles.map(sa => sa.article), article_id)) {
        cb(saved_articles.filter(sa => sa.article.id === article_id)[0].notes.slice());
    } else {
        cb([]);
    }
}

function removeNote(article_id, note_id, cb) {
    if(articleAlreadyExists(saved_articles.map(sa => sa.article), article_id) && 
       note_id && noteAlreadyExists(saved_articles.map(sa => sa.notes), note_id)) {
        let entry = saved_articles.filter(sa => sa.article.id === article_id)[0];
        entry.notes = entry.notes.filter(n => n.id !== note_id);
        cb(true);
    } else {
        cb(false);
    }
}

var news_scraper_db = {
    storeDisplayedArticles: storeDisplayedArticles,
    getDisplayedArticles: getDisplayedArticles,
    saveArticle: saveArticle,
    getSavedArticles: getSavedArticles,
    clearSavedArticles: clearSavedArticles,
    removeSavedArticle: removeSavedArticle,
    saveNote: saveNote,
    getNotes: getNotes,
    removeNote: removeNote 
}

module.exports = news_scraper_db;