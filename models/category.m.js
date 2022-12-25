const { as } = require('pg-promise');
const pdb = require('../db/pdb');

module.exports = {
    all: async() => {
        const rs = await pdb.load('SELECT * FROM "Categories"',[]);
        return rs;
    }, 
};