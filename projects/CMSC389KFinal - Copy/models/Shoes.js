var mongoose = require('mongoose');
mongoose.Promise = global.Promise

var reviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min: 0.0,
        max: 5.0,
        required:true
    },
    user:{
        type: String,
        required:true
    },
    comment:{
        type: String
       
    }

});


var shoeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    cost:{
        type:Number,
        required:true
    },
    reviews:[reviewSchema]
});


var Shoe = mongoose.model('Shoe',shoeSchema);

module.exports = Shoe;  