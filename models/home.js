"use strict";

const Model = require('./model');

class Home extends Model {

    static getContent () {
        // we're returning this directly since db.query in this instance returns a Promise
        return db.query("SELECT * FROM `users`")
        .then(result => {
            let contant = result.map(i => new Model(i))
            return contant
        })
    }
}

module.exports = Home
