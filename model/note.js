var hashCodeGenerator = require("./hashCodeGenerator.js");

class Note {

    constructor(id, text, author) {
        if(text) {
            this._text = text;
        } else {
            this._text = "";
        }
        if(author) {
            this._author = author;
        } else {
            this._author = "";
        }
        if(id) {
            this._id = id;
        } else {
            this._id = hashCodeGenerator(JSON.stringify({text: this._text, author: this._author}));
        }
    }

    get id() {
        return this._id;
    }

    get text() {
        return this._text;
    }

    get author() {
        return this._author;
    }

}

module.exports = Note;