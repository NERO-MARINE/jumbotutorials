const express = require('express');
const router = express.Router();
const blogControllers = require('../controllers/blog-controllers')

router.get('/',blogControllers.homePage);
router.get('/privacy-policy',blogControllers.privacyPage);
router.get('/tutorial/:categoryName',blogControllers.categoriesContent);
router.get('/post/:slug/:postName',blogControllers.postDetails);
router.post('/search',blogControllers.searchPost);
router.get('/create', blogControllers.checkAuth, blogControllers.create_get);
router.post('/create',blogControllers.checkAuth, blogControllers.create_post);
router.get('/editPost/:id',blogControllers.checkAuth,blogControllers.edit_post);
router.put('/editPost/:id',blogControllers.checkAuth,blogControllers.editPost_put);
router.delete('/deletePost/:id',blogControllers.checkAuth,blogControllers.deletePost);
router.get('/category-add',blogControllers.checkAuth, blogControllers.add_category);
router.post('/addNewCategory',blogControllers.checkAuth, blogControllers.upload, blogControllers.newCategory)
router.get('/editCategory/:id',blogControllers.checkAuth, blogControllers.editCategory_get);
router.put('/editCategory/:id',blogControllers.checkAuth, blogControllers.upload, blogControllers.editCategory_put);
router.delete('/deleteCategory/:id',blogControllers.checkAuth,blogControllers.deleteCategory);
router.get('/signup',blogControllers.getSignup);
router.post('/signup',blogControllers.postSignup);
router.get('/login',blogControllers.getLogin);
router.post('/login',blogControllers.postLogin);
router.get('/logout',blogControllers.logout);

module.exports = router;