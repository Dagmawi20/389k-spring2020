var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var dotenv = require('dotenv');
var Shoes = require('./models/Shoes');
var exphbs = require('express-handlebars'); 
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var Handlebars = require('handlebars');
var Mymod = require('./my-mod');

dotenv.config();
console.log(process.env.MONGODB); 
mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.engine('handlebars', exphbs({
     defaultLayout: 'main' })); 
app.engine('handlebars', exphbs({
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    }));
app.set('view engine', 'handlebars'); 
app.use('/public', express.static('public')); 

app.get('/',function(req,res){
    res.render('home');
});

app.get('/addShoes',function(req,res){
    res.render('addShoes');
});

app.post('/api/addShoes',function(req,res){
    var shoes = new Shoes({
        name: req.body.name,
        image:req.body.image,
        cost: parseFloat(req.body.cost),
        reviews:[]
    });

    shoes.save(function(err){
        if(err) throw err;
        return res.redirect('/');
    });
});

app.delete('/shoe/:id',function(req,res){
    Shoes.findByIdAndRemove(req.params.id, function(err,shoes){
        if(err) throw err;
        if(!shoes){return res.send('No shoes match to the given id!');}
        return res.redirect('/');
    });
});

app.get('/catalog',function(req,res){
    Shoes.find({}).then(shoes=>{
        var result = Mymod(shoes);
        res.render('catalog',{
            data:result,
        });
    });
});


app.get('/addReview',function(req,res){
    Shoes.find({}).then(shoes=>{
        var result = Mymod(shoes);
        res.render('addReview',{
            data:result,
        });
    });
});


app.post('/shoe/review', function(req, res) {
    console.log(req.body.shoeChoice);
    Shoes.findOne({ name: req.body.shoeChoice },function(err,shoe){
        if (err) throw err;
        if (!shoe) return res.send('No shoe found with that name.');

        //Creating the review schema
        shoe.reviews.push({
            rating: parseFloat(req.body.rating),
            user:req.body.user,
            comment: req.body.comment
        });

        shoe.save(function(err) {
            if (err) throw err;
            return res.redirect('/');
        });

    });

});

app.get('/bestReviews',function(req,res){
    Shoes.find({}).then(shoes=>{
        var ratings = [];
        var best =  {
            name:null,
            image:null,
            rating:0
        };
        shoes.map(shoe=>{
            var totalCount = 0;
            var reviewCount = 0;
            shoe.reviews.map(review=>{
                totalCount+=review.rating;
                reviewCount+=1;
            });
            ratings.push({
                name:shoe.name,
                image:shoe.image,
                average:totalCount/reviewCount
            });
        });

        ratings.map(shoeAvg=>{
            if(shoeAvg.average>best.rating){
                best.name = shoeAvg.name;
                best.image = shoeAvg.image;
                best.rating = shoeAvg.average;
            }
        });

        res.render('best',{
            data:best
        });
    });
});

app.get('/expensiveShoes',function(req,res){
    Shoes.find({}).then(shoes=>{
        var result = shoes.map(shoe => shoe.toJSON());
        var max = {
            name:null,
            image:null,
            cost:0
        };
        result.map(shoe => {
            console.log(shoe);
            if(shoe.cost > max.cost){
                max.name = shoe.name;
                max.image = shoe.image;
                max.cost = shoe.cost;
            }
        });
        console.log(max);
        
        res.render('pricy',{
            data:max,
        });
    });
});

app.get('/jordan',function(req,res){
    Shoes.find({}).then(shoes=>{
        var jordans = [];
        shoes.filter(shoe=>{
            if(shoe.name.match(/Jordan/)){
                jordans.push(shoe);
            }
        });
        res.render('jordan',{
            data:jordans
        });
    });
});
app.get('/about',function(req,res){
    res.render('about');
});

app.get(`/random`,function(req,res){ 
           //randomly choses store from JSON object
           Shoes.find({}).then(shoes=>{
            var lenData = shoes.length;
            var randomVal = Math.floor((Math.random()*lenData)+1)-1;
            var randomShoe = shoes[randomVal];
            res.render('random',{
                data:randomShoe
            });
           }); 
     	   
      	}); 

app.get('/budgeting',function(req,res){
    Shoes.find({}).then(shoes=>{
        var result = shoes.filter(shoe=>shoe.cost<=200);
        res.render('budgeting',{
            data:result
        });
    });
});
app.delete('/shoe/:id/review/last', function(req, res) {
    // Exercise: Fill this endpoint in to delete the most recently added review for the specified movie
    Shoes.findOne({ _id: req.params.id },function(err,shoes){
        if (err) throw err;
        if (!shoes) return res.send('No Shoes match the given id!');
        
        //pops last element of the review array
        shoes.reviews.pop();
        
        //saves the reviews array
        shoes.save(function(err) {
            if (err) throw err;
            res.redirect('/');
        });
    });
});



app.listen(process.env.PORT || 3000, function() {
    console.log('Listening!');
});

