const Article = require("../model/article.js");

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var mongoDB = process.env.MONGODB_URI || process.env.MONGOHQ_URL;
    
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//var displayed_articles = db.collection('displayed_articles');
//var saved_articles = db.collection('saved_articles');

var ArticleModel = mongoose.model('Article',
    new Schema({
        id: {
            type: Number,
            index: true,
            unique: true,
            required: true
        },
        headline: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        original_article: {
            type: String,
            required: true
        }
    }),
    'displayed_articles'
);

var SavedArticleModel = mongoose.model('SavedArticle',
    new Schema({
        article: {
            id: {
                type: Number,
                index: true,
                unique: true,
                required: true
            },
            headline: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            original_article: {
                type: String,
                required: true
            }    
        },
        notes: [
            {
                id: {
                    type: Number,
                    required: true
                },
                author: {
                    type: String,
                    required: true
                },
                text: {
                    type: String,
                    required: true
                }
            }
        ]
    }),
    'saved_articles'
);

function saveArticle(id, cb) {
    if(id) {
        SavedArticleModel.countDocuments({article: {id: id}}, function(saError, count) {
            if(count === 0) {
                ArticleModel.findOne({id: id}, function(amError, articleDoc) {
                    console.log("article: " + articleDoc);
                    if(articleDoc) {
                        let article = articleDoc.toObject({getters: true});
                        let savedArticleToStore = new SavedArticleModel({article: article, notes: []});
                        savedArticleToStore.save(function(insertError) {
                            if(insertError) {
                                cb(false);
                            } else {
                                ArticleModel.remove({id: id}, function(error) {});
                                cb(true);
                            }
                        });    
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

function getSavedArticles(cb) {
    SavedArticleModel.find({}, function(error, result) {
        console.log("result: " + result);
        var articles = [];
        result = result.map(o => o.toObject());
        result.forEach(sa => {
            let notes = sa._notes.map(n => ({id: n._id, author: n._author, text: n._text}));
            articles.push({article: {id: a._id, headline: a._headline, description: a._description, original_article: a._original_article}, notes: notes });        
        });
        console.log("saved articles: " + articles);
        cb(articles.map(sa => sa.article));
    });   
}

function getDisplayedArticles(cb) {
    ArticleModel.find({}, function(error, result) {
        var articles = [];
        result = result.map(o => o.toObject());
        result.forEach(a => {
            articles.push(new Article(a._id, a._headline, a._description, a._original_article));
        })
        cb(articles);
    });
}

function clearSavedArticles() {
    SavedArticleModel.remove({}, function(error) {});
}

function clearDisplayedArticles() {
    ArticleModel.remove({}, function(error) {});
}

function removeSavedArticle(id, cb) {
    if(id) {
        SavedArticleModel.findOne({article: {id: id}}, function(saError, savedArticleDoc) {
            if(!saError) {
                let savedArticle = savedArticleDoc.toObject({getters : true});
                var articleToSave = new ArticleModel(savedArticle.article)
                articleToSave.save(function(amError) {
                    if(!amError) {
                        SavedArticleModel.remove({article: {id: id}}, function(error) {});
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
            SavedArticleModel.countDocuments({article: {id: article.id}}, function(saError, saCount) {
                if(saCount === 0) {
                    ArticleModel.countDocuments({id: article.id}, function(amError, amCount) {
                        if(amCount === 0) {
                            let articleToStore = new ArticleModel(article)
                            articleToStore.save(function(error) {
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
        SavedArticleModel.findOne({article: {id: article_id}}, function(saError, savedArticleDoc) {
            if(!saError) {
                let savedArticle = savedArticleDoc.toObject({getters: true});
                if(savedArticle.notes.filter(n => n.id === note.id).length === 0) {
                    savedArticle.notes.push(note);
                    SavedArticleModel.findOneAndUpdate({article: {id: article_id}}, savedArticle, function(updateError, result) {
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
        SavedArticleModel.findOne({article: {id: article_id}}, function(saError, savedArticleDoc) {
            if(!saError) {
                let savedArticle = savedArticleDoc.toObject({getters: true});
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
        SavedArticleModel.findOne({article: {id: article_id}}, function(saError, savedArticleDoc) {
            if(!saError) {
                let savedArticle = savedArticleDoc.toObject({getters: true});
                savedArticle.notes = savedArticle.notes.filter(n => n.id !== note_id);
                SavedArticleModel.findOneAndUpdate({article: {id: article_id}}, savedArticle, function(updateError, result) {
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