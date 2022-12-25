const initOptions = {};
const pgp = require('pg-promise')(initOptions);

const cn = require('../configs/cnStr');

const db = pgp(cn);

exports.load = (queryParam,value) => {
    return new Promise((resolve, reject) => {
        db.query(queryParam,value)
            .then(data => resolve(data))
            .catch(error => reject(error));
    })
} 