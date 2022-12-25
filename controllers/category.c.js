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
}