const categoryM = require('../models/category.m');

module.exports = {
    all: async () => {
        try {
            const categories = await categoryM.all();
            return categories;
        } catch (error) {
            console.log(err);
        }
    },
    del: async (id) => {
        try {
            const catDel = await categoryM.del(id);
            return catDel;
        } catch (error) {
            console.log(error);
        }
    },
    add: async(cat) => {
        try {
            const catAdd= await categoryM.add(cat);
            return catAdd;
        } catch (error) {
            console.log(error);
        }
    },
    update: async(cat) =>{
        try {
            const catUpdate = await categoryM.update(cat);
            return catUpdate;
        } catch (error) {
            console.log(error);
        }
    }
}