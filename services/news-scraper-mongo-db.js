var mongoose = require('mongoose');

var mongoDB = process.env.MONGODB_URI || process.env.MONGOHQ_URL;
    
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var displayed_articles = db.collection('displayed_articles');
var saved_articles = db.collection('saved_articles');

function saveArticle(id, cb) {
    if(id) {
        saved_articles.countDocuments({article: {id: id}}, function(saError, count) {
            if(count === 0) {
                displayed_articles.findOne({id: id}, function(amError, article) {
                    saved_articles.insert({article: article, notes: []}, function(insertError, result) {
                        if(insertError) {
                            cb(false);
                        } else {
                            displayed_articles.remove({id: id}, function(error) {});
                            cb(true);
                        }
                    });
                });
            } else {
                cb(false);
            }
        });
    } else {
        cb(false);
    }
}

function getSavedArticles(cb) {
    saved_articles.find({}, function(error, result) {
        cb(result.map(sa => sa.article));
    });   
}

function getDisplayedArticles(cb) {
    displayed_articles.find({}, function(error, result) {
        cb(result.map(x => new Article(x._id, x._headline, x._description, x._original_article)));
    });
}

function clearSavedArticles() {
    saved_articles.remove({}, function(error) {});
}

function clearDisplayedArticles() {
    displayed_articles.remove({}, function(error) {});
}

function removeSavedArticle(id, cb) {
    if(id) {
        saved_articles.findOne({article: {id: id}}, function(saError, savedArticle) {
            if(!saError) {
                displayed_articles.insert(savedArticle.article, function(amError, result) {
                    if(!amError) {
                        savedArticle.remove({article: {id: id}}, function(error) {});
                        cb(true);
                    } else {
                        cb(false);
                    }
                })
            } else {
                cb(false);
            }
        });
    } else {
        cb(false);
    }
}

function storeDisplayedArticles(articles, cb) {
    if(articles && articles.length > 0) {
        articles.forEach(article => {
            saved_articles.countDocuments({article: {id: article.id}}, function(saError, saCount) {
                if(saCount === 0) {
                    displayed_articles.countDocuments({id: article.id}, function(amError, amCount) {
                        if(amCount === 0) {
                            displayed_articles.insert(article, function(error, result) {
                            });
                        }
                    });
                }
            });
        });
        cb(true);
    } else {
        cb(false);
    }
}

function saveNote(article_id, note, cb) {
    if(article_id && note) {
        saved_articles.findOne({article: {id: article_id}}, function(saError, savedArticle) {
            if(!saError) {
                if(savedArticle.notes.filter(n => n.id === note.id).length === 0) {
                    savedArticle.notes.push(note);
                    saved_articles.findOneAndUpdate({article: {id: article_id}}, savedArticle, function(updateError, result) {
                        if(!updateError) {
                            cb(true);
                        } else {
                            cb(false);
                        }
                    });
                } else {
                    cb(false);
                }
            } else {
                cb(false);
            }
        });    
    } else {
        cb(false);
    }
}

function getNotes(article_id, cb) {
    if(article_id) {
        saved_articles.findOne({article: {id: article_id}}, function(saError, savedArticle) {
            if(!saError) {
                cb(savedArticle.notes.slice());
            } else {
                cb([]);
            }
        });    
    } else {
        cb([]);
    }
}

function removeNote(article_id, note_id, cb) {
    if(article_id && note) {
        saved_articles.findOne({article: {id: article_id}}, function(saError, savedArticle) {
            if(!saError) {
                savedArticle.notes = savedArticle.notes.filter(n => n.id !== note_id);
                saved_articles.findOneAndUpdate({article: {id: article_id}}, savedArticle, function(updateError, result) {
                    if(!updateError) {
                        cb(true);
                    } else {
                        cb(false);
                    }
                });
            } else {
                cb(false);
            }
        });    
    } else {
        cb(false);
    }
}

var news_scraper_db = {
    storeDisplayedArticles: storeDisplayedArticles,
    clearDisplayedArticles: clearDisplayedArticles,
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