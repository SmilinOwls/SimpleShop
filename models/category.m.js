const { as } = require('pg-promise');
const pdb = require('../db/pdb');

module.exports = {
    all: async() => {
        const rs = await pdb.load('SELECT * FROM "Categories"',[]);
        return rs;
    }, 
    del: async(id) => {
        const rs = await pdb.load('DELETE FROM "Categories" WHERE "CatID" = $1 RETURNING *',[id]);
        return rs;
    },
    add: async(cat) =>{
        const rs = await pdb.load('INSERT INTO "Categories" VALUES($1,$2) RETURNING *',[cat.CatID,cat.CatName]);
        return rs;
    },
    update: async(cat) => {
        const rs = await pdb.load('UPDATE "Categories" SET "CatName" = $1 WHERE "CatID" = $2 RETURNING *',[cat.CatName,cat.CatID]);
        return rs;
    }
};