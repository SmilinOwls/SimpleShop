const productM = require('../models/product.m');

module.exports = {
    all: async() => {
        try {
            const rs = await productM.all();
            return rs;
        } catch (error) {
            console.log(error);
        }
    },
    allByCatId: async (id) =>{
        try {
            const rs = await productM.allByCatId(id);
            return rs;
        } catch (error) {
            console.log(error);
        }
    }
};