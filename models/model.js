"use strict";

class Model {

    constructor(properties) {

        if(properties) {

            for(let key in properties) {

                if(!this.hasOwnProperty(key)) {
                    this[key] = properties[key]
                }

            }

        }

    }

}

module.exports = Model
