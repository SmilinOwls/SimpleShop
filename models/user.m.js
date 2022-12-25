const pdb = require('../db/pdb');

module.exports = {
    all: async() => {
        const rs = await pdb.load('SELECT * FROM "Users"',[]);
        return rs;
    },

    add: async (u) => {
        const rs = await pdb.load('INSERT INTO "Users" VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[u.UserID,u.Username,u.Password,u.FullName,u.Token,u.Address]);
        return rs;
    },

    byid: async() => {
        const rs = await pdb.load('SELECT MAX("UserID") FROM "Users"'); 
        return rs;
    },

    byname: async username => {
        const rs = await pdb.load('SELECT * FROM "Users" WHERE "Username" = $1',[username]); 
        return rs;
    },
};