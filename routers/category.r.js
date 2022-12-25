const e = require('express');
const express = require('express');
const router = express.Router();
const categoryC = require('../controllers/category.c');
const productC = require('../controllers/product.c');


router.get('/', async (req, res, next) => {

    if (req.cookies.expired) {
        const categories = await categoryC.all();
        categories.forEach(cat => {
            cat.isActive = false;
        });
        categories[0].isActive = true;
        res.render('home', {
            categories: categories,
            products: [],
            chk: true,
            title: "Category"
        })
    } else{
        res.redirect('/user/signin');
    }
});

router.use('/:id/product', async (req, res, next) => {
    const id = parseInt(req.params.id);
    const categories = await categoryC.all();
    const products = await productC.allByCatId(id);
    for (let category of categories) {
        category.isActive = false;
        if (category.CategoryID === id) category.isActive = true;
    }

    res.render('home', { categories: categories, products: products, chk: true, title: "Product" })

});

router.use('/curd', async (req, res, next) => {
    const categories = await categoryC.all();
    res.render('curd', { title: "CURD category", categories: categories, chk: true });
});

router.post('/add', async (req, res, next) => {
    const categories = await categoryC.all();
    res.render('curd', { title: "Add category", categories: categories, chk: true, add: true });
});



module.exports = router;