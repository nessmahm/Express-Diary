const express = require ('express');
const bodyParser = require('body-parser');
const app = express();
if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
 }

const mongoose = require('mongoose');
const Diary = require('./models/Diary');
const methodOverride = require('method-override');
const port =  process.env.PORT || 3000 ;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
//database : 
const url = "mongodb+srv://"+process.env.USER_NAME+":"+process.env.USER_PASSWORD+'@expresscluster.4ensye9.mongodb.net/Diary?retryWrites=true&w=majority';
mongoose.connect(url,{useNewUrlParser:true,
                      useUnifiedTopology:true
                     }).then(console.log("mongo db connected successfully"))
                        .catch(err => console.log(err));

//routing 
 app.get ('/', (req, res) => {res.render('Home')})
 app.get ('/about', (req, res) => {res.render("About")})
 app.get ('/diary', (req, res) => {
   Diary.find().then((data) => {  res.render("Diary",{data: data}) 
   }).catch((err) => { console.log(err) } ) ;

  })
  app.get('/diary/:id', (req, res) => {
   Diary.findOne({ _id: req.params.id 
   }).then((data) => {  res.render("Page",{data: data})
   }).catch((err) => { console.log(err) } ) ;
}) 
app.get('/diary/edit/:id', (req, res) => {
   Diary.findOne({ _id: req.params.id 
   }).then((data) => {  res.render("Edit",{data: data})
   }).catch((err) => { console.log(err) } ) ;
})
app.put ('/diary/edit/:id' , (req, res) => {
   Diary.findOne({ _id:req.params.id 
      }).then(data=> {
            data.title = req.body.title 
            data.description=req.body.description
            data.date=req.body.date
            console.log('Data modifying ... ');
            data.save().then(() => {
               console.log('Data modified succefully ... ') ; 
               res.redirect('/diary') ; 
            }).catch(err=> console.log(err) );
      }).catch(err=> console.log(err) );
});

app.delete('/diary/delete/:id',(req, res)=> { 

   Diary.remove({_id:req.params.id
      }).then(()=> { res.redirect('/diary');
      }).catch(err=> console.log(err));


});

 app.get ('/add', (req, res) => {res.render("Add")})
 app.post ('/add-to-diary', (req, res) => { 
      const Data = new Diary({
      title : req.body.title,
      description : req.body.description,
      date : req.body.date
      })
      console.log('Data saving ... ');
   Data.save().then(() => {
       console.log('Data saved succefully ... ') ; res.redirect('/diary') ; 
       } ) .catch(err=> console.log(err) );
      });


 app.listen (port,()=>{console.log('listening');  });
//process.env.USER_PASSWORD