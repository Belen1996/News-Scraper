var hashCodeGenerator = require("./hashCodeGenerator.js");

class Article {

    constructor(id, headline, description, original_article) {
        if(headline) {
            this._headline = headline;
        } else {
            this._headline = "";
        }
        if(description) {
            this._description = description;
        } else {
            this._description = "";
        }
        if(original_article) {
            this._original_article = original_article;
        } else {
            this._original_article = "";
        }
        if(id) {
            this._articleId = id;
        } else {
            this._articleId = hashCodeGenerator(JSON.stringify({headline: this._headline, description: this._description, original_article: this._original_article}));
        }
    }

    get articleId() {
        return this._articleId;
    }

    get headline() {
        return this._headline;
    }

    get description() {
        return this._description;
    }

    get original_article() {
        return this._original_article;
    }

}

module.exports = Article;