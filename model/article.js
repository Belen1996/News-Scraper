var hashCodeGenerator = require("./hashCodeGenerator.js");

class Article {

    constructor(headline, description, original_article, notes) {
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
        this._id = hashCodeGenerator(JSON.stringify({headline: this._headline, description: this._description, original_article: this._original_article}));
        if(notes) {
            this._notes = notes;
        } else {
            this._notes = [];
        }
    }

    get id() {
        return this._id;
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

    get notes() {
        return this._notes;
    }

}

module.exports = Article;