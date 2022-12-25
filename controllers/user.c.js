const userM = require('../models/user.m');

module.exports = {
    all: async () => {
        try {
            const users = await userM.all();
            return users;
        } catch (error) {
            console.log(err);
        }

    },
    add: async (u) => {
        try {
            const users = await userM.add(u);
            console.log('Add a user successfully!');
        } catch (error) {
            console.log(error);
        }

    },

    getMaxId: async () => {
        try {
            const maxId = await userM.byid();
            return maxId[0].max;
        } catch (error) {
            console.log(error);
        }
    },

    byName: async username => {
        try {
            const user = await userM.byname(username);
            return user;
        } catch (error) {
            console.log(error);
        }
    }
}