const Category = require("../model/categories");
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs')
const Post = require("../model/post");
const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
//require passport file
require('./passportlocals')(passport);



let storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, './uploads');
  },
  // file name for uploaded files
  filename: function(req,file,cb){
      // cb(null, file.fieldname+'_'+Date.now()+'_'+file.originalname);
      cb(null, file.fieldname+'_'+file.originalname);
  }
})

let upload = multer({
  storage: storage,
}).single('image');


// check if authenticated
const checkAuth = function(req,res,next){
  if(req.isAuthenticated()){
      // to prevent caching
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    next()
  }else{
    res.redirect('/login')
  }
}

const homePage = async (req, res) => {
  try {
    const categories = await Category.find();
   if(req.isAuthenticated()){
    // console.log(req.user)
    res.render("index", { title: "Welcome to Jumbo Tutorials, your home of free tutorials", categories, username: req.user.username, loggedin: true, csrfToken: req.csrfToken()});
   }
   else{
    res.render("index", { title: "Welcome to Jumbo Tutorials, your home of free tutorials", categories, username: '', loggedin: false, csrfToken: req.csrfToken() });
   }
  } catch (err) {
    console.log(err);
  }
};


const categoriesContent = async(req, res) => {
    try{
          const category_Name = req.params.categoryName;
          const posts = await Post.find({category:category_Name});  
          // FIND CATEGORIES
          const categories = await Category.find({name:category_Name});
          if(req.isAuthenticated()){
            res.render('categories-content', { title: `${categories[0].name}`, posts, categories, loggedin: true ,csrfToken: req.csrfToken()});
           }
           else{
            res.render('categories-content', { title: `${categories[0].name}`, posts, categories, loggedin: false,csrfToken: req.csrfToken() });
           }
          
    }

    catch(err){
         console.log(err)
    }
    
  };

  // for post details
const postDetails = async(req,res)=>{
    try{
        const slug = req.params.slug;
        // check if id is valid
        // if(!mongoose.Types.ObjectId.isValid(id)){
        //     res.redirect('back');
        //     return;
        // }

        const postName = req.params.postName;
        const postDetails = await Post.findOne({slug: slug});
        if(postDetails == null){
          res.redirect('back');
           return;
        }
        const post_Names = await Post.find({category: postName}); 
        if(req.isAuthenticated()){
          res.render('categories-content',{ title: `${postDetails.name}`, postDetails, post_Names, loggedin: true,csrfToken: req.csrfToken()})

         }
         else{
          res.render('categories-content',{ title: `${postDetails.name}`, postDetails, post_Names, loggedin: false,csrfToken: req.csrfToken()})
         }
    }
    catch(err){
     console.log(err)
    }
  }

  const searchPost = async (req,res)=>{
    try{
      let searchPost = req.body.searchPost;
      let searchResults = await Post.find({$text:{
       $search:searchPost,
       $diacriticSensitive:true
      }});
      // res.json(searchResults);
      res.render('search',{title:'Search-results',searchResults, csrfToken: req.csrfToken()});
    }
    catch(err){
      console.log(err)
    }
  }
  // get create post
  const create_get = async (req,res)=>{
      try{
      res.render('create',{title:'create-post',csrfToken: req.csrfToken()})
      }
      catch(err){
      console.log(err) 
      }
  }

  

  const create_post = async(req, res)=>{
    try{

      // create new post
         const newPost = new Post({
            'name': req.body.name,
            'body': req.body.body,
            'category': req.body.category
         });
         await newPost.save();
         res.redirect('/');
    }

    catch(err){
      console.log(err);
    }
  }
  //edit post
  const edit_post= async (req,res)=>{
        try{
            const id = req.params.id;
            if(!mongoose.Types.ObjectId.isValid(id)){
              res.redirect('back');
              return;
          }
            const editPost = await Post.findById(id);
            res.render('edit_post', {title: 'edit_post', editPost,csrfToken: req.csrfToken()})
        }
        catch(err){
            console.log(err)
        }
  }

  const editPost_put = async (req,res)=>{
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
          res.redirect('back');
          return;
      }
        const toBEditedPost = await Post.findByIdAndUpdate(id);

        toBEditedPost.name = req.body.name;
        toBEditedPost.body = req.body.body ;
        toBEditedPost.category = req.body.category;
        await toBEditedPost.save();
        res.redirect(`/post/${toBEditedPost._id}/${toBEditedPost.category}`)
    }
    catch(err){
      console.log(err)
    }
  }

  //delete post
  const deletePost = async (req,res)=>{
    try{
         const id = req.params.id;
         if(!mongoose.Types.ObjectId.isValid(id)){
          res.redirect('back');
          return;
      }
         await Post.findByIdAndDelete(id);
         res.redirect('/')
    }
    catch(err){
      console.log(err)
    }
  }


  //get add new category page
  const add_category = async (req,res)=>{
    try{
    res.render('category-add',{title:'new-category', csrfToken: req.csrfToken()})
    }
    catch(err){
    console.log(err) 
    }
      }


  //new category
  const newCategory = async (req,res)=>{
     
    try{
         const newCategory = new Category({
          'name':req.body.name,
          'body':req.body.body,
          'image': req.file.filename,
         })
         await newCategory.save()
         res.redirect('/')
    }
    catch(err){
    console.log(err)
    }
  }

const privacyPage = (req, res) => {
  res.render("privacy", { title: "privacy-policy",csrfToken: req.csrfToken()});
};


// Edit Category

const editCategory_get = async(req,res)=>{
   try{
    const id = req.params.id
   
    const toBeEditedCategory = await Category.findById(id);
    // console.log(id);
    res.render('editCategory', {title: 'edit_category', toBeEditedCategory, csrfToken: req.csrfToken()});
   }

   catch(err){
    console.log(err)
   }
}


const editCategory_put = async(req,res)=>{
try{
   
   const id = req.params.id
   let new_image = '';
        
   if(!mongoose.Types.ObjectId.isValid(id)){
       res.redirect('/');
       return;
       }

   if(req.file){
       new_image = req.file.filename;
       // remove the old image with fs module
       try{
           fs.unlinkSync('./uploads/' +req.body.old_image);
       }
       catch(err){
          console.log(err)
       }

   } else{
       new_image = req.body.old_image
   }

   const editedCategory = await Category.findByIdAndUpdate(id);
   editedCategory.name = req.body.name;
   editedCategory.body = req.body.body;
   editedCategory.image = new_image;

   await editedCategory.save();
  //  res.json(editedCategory)
   res.redirect(`/tutorial/${editedCategory.name}`);
   
}
catch(err){
console.log(err)
}
}

const deleteCategory = async (req,res)=>{
  try{
      const id = req.params.id;
      if(!mongoose.Types.ObjectId.isValid(id)){
        res.redirect('back');
        return;
    }
    //  res.send(id)
      const catDelete = await Category.findByIdAndDelete(id)
      res.redirect('/')
  }
  catch(err){
    console.log(err)
  }
}

const getSignup = async (req,res)=>{
  try{
    res.render('signup',{title:'signup', csrfToken: req.csrfToken()})
  }catch(err){
    console.log(err)
  }
}

const postSignup = async(req,res)=>{
  /// get all form values
  const {email,uname,psw,psw_repeat} = req.body;
  // check if fields are empty;
  if(!email || !uname || !psw || !psw_repeat){
   res.render('signup',{title:'signup', err:'All fields are required', csrfToken: req.csrfToken()});

  }else if(psw != psw_repeat){
   res.render('signup',{title:'signup', err:'Password and repeat password does not match', csrfToken: req.csrfToken()});

  } else{
    // check if user exists
    User.findOne({$or: [{email: email}, {username: uname}]}, function(err, data){
      if(err) throw err;
      if(data){
        res.render('signup',{title:'signup', err:'User already exist', csrfToken: req.csrfToken()});
 
      } else{
        // generate salt using bcryptjs
        bcryptjs.genSalt(12, function(err,salt){
          if(err) throw err;
          if(salt){
            bcryptjs.hash(psw, salt, function(err,hash){
              if(err) throw err;
              // else create a new instance of a user
              const newUser = new User({
                email: email,
                username: uname,
                password: hash,
                googleId: null,
                provider: 'email'
              });
              newUser.save((err, data)=>{
                 if(err) throw err;
                 res.redirect('/login');
              })
            })
          }
        })
      }
    })
  }

}

const getLogin = async (req,res)=>{
  try{
    res.render('login',{title:'Login', csrfToken: req.csrfToken()})
  }catch(err){
    console.log(err)
  }
}



const postLogin = async(req,res,next)=>{
  passport.authenticate('local',{
    failureRedirect: '/login',
    successRedirect: '/',
    failureFlash: true

  })(req, res, next)
}

// logout
const logout = (req,res,next)=>{
  req.logout(function(err) {
      if (err) { return next(err); }
      req.session.destroy(function(err){
          res.redirect('/');
      })
    });

}


module.exports = {
  homePage,
  privacyPage,
  categoriesContent,
  postDetails,
  searchPost,
  create_get,
  add_category,
  create_post,
  edit_post,
  editPost_put,
  deletePost,
  newCategory,
  editCategory_get,
  editCategory_put,
  deleteCategory,
  getSignup,
  getLogin,
  postLogin,
  postSignup,
  checkAuth,
  logout,
  upload
};
