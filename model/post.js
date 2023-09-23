const mongoose= require('mongoose')
const marked  = require('marked');
const slugify = require('slugify')
//require dom purifier
const dompurify = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = dompurify(new JSDOM().window)

const Schema = mongoose.Schema;

const postSchema = new Schema ({
name:{
    type:String,
    required:true,
},


category:{
    type:String,
    enum: ['HTML5','CSS','JAVASCRIPT','HOWTO','BOOTSTRAP', 'NODEJS', 'JAVA', 'PYTHON'],
    required:true,
},


body:{
    type:String,
    required:true,
},
purifiedHtml:{
    type:String,
    required:true,
},
slug:{
    type: String,
    required: true,
    unique: true
}

},{timestamps:true})

//for search
postSchema.index({
    name:'text',
    body:'text'
});
// wild card indexing
// postSchema.index({
//     "$**": 'text'
// });



//purify html
postSchema.pre('validate', function(next){
    // for slug
    if(this.name){
       this.slug = slugify(this.name, { lower: true, strict: true})
    }

    // for markdown
    if(this.body){
        this.purifiedHtml = htmlPurify.sanitize(marked.parse(this.body))
    }
    next()
})

const Post = mongoose.model('post',postSchema);

module.exports = Post;