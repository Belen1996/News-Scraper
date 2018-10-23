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
            this._noteId = id;
        } else {
            this._noteId = hashCodeGenerator(JSON.stringify({text: this._text, author: this._author}));
        }
    }

    get noteId() {
        return this._noteId;
    }

    get text() {
        return this._text;
    }

    get author() {
        return this._author;
    }

}

module.exports = Note;