const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
//conect to db
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(config.database);
  console.log('conected to mongoDB')
}
//init app
const app = express();

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set global variable
app.locals.err = null;

//Get Page Model
const Page = require('./models/page');
//Get all pages and pass to header.ejs
Page.find({}).sort({sorting: 1}).exec(function(err,pages){
  if (err) {
    console.log(err);
    res.send('Internal Server Error! Please Try again!')
  } else {
    app.locals.pages = pages;
  }
});

//Get Category Model
const Category = require('./models/category');
//Get all pages and pass to header.ejs
Category.find({}).sort({sorting: 1}).exec(function(err,cat){
  if (err) {
    console.log(err);
    res.send('Internal Server Error! Please Try again!')
  } else {
    app.locals.cats = cat;
  }
});

//Express file upload middleware
app.use(fileUpload());

//Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

//Express validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  },
  customValidators: {
    isImage: function (value, filename) {
      let extensinon = (path.extname(filename)).toLowerCase();
      switch (extensinon) {
        case '.jpg':
          return '.jpg';
        case '.jpeg':
          return '.jpeg';
        case '.png':
          return '.png';
        case '':
          return '.jpg';
        default:
          return false;
      };
    }
  }
}));

//Express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function (req, res, next) {
  res.locals.cart = req.session.cart;
  next();  
});

//Routes
const products = require('./routes/products');
const cart = require('./routes/cart');
const pages = require('./routes/pages');
const adminPages = require('./routes/admin_pages');
const adminCategories = require('./routes/admin_categories');
const adminProducts = require('./routes/admin_products');
const { get } = require('http');

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', products);
app.use('/cart', cart);
app.use('/', pages);

//Start server
const port = 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`app listening port ` + port);
})