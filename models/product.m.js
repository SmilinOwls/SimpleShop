const pdb = require('../db/pdb');

module.exports = {
    all: async() => {
        const rs = await pdb.load('SELECT * FROM "Products"',[]);
        return rs;
    },
    allByCatId: async (id) =>{
        const rs = await pdb.load('SELECT * FROM "Products" WHERE "CatID"=$1',[id]);
        return rs;
    }
};