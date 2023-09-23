const mongoose= require('mongoose')
const marked = require('marked');
//require dom purifier
const dompurify = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = dompurify(new JSDOM().window)

const Schema = mongoose.Schema;

const categorieSchema = new Schema ({
name:{
    type:String,
    required:true,
    uppercase: true
},

image:{
    type:String,
    required:true,
},
 
body:{
    type:String,
    required:true,
},
purifiedHtml:{
    type:String,
    required:true,
}

},{timestamps:true})

categorieSchema.index({
    name:'text',
    body:'text'
});

categorieSchema.pre('validate', function(next){
    if(this.body){
        this.purifiedHtml = htmlPurify.sanitize(marked.parse(this.body))
    }
    next()
});

const Category = mongoose.model('Category',categorieSchema);

module.exports = Category;