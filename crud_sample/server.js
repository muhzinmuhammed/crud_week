const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')

const bodyParser=require('body-parser')
const path=require('path')
const bcrypt=require('bcrypt')
const session = require('express-session');
const nocashe=require('nocache')
// The folder path for the files
const folderPath = __dirname+'/Files';

var UserDb=require('./server/model/model')
const { name } = require('ejs')
// const connectDB=require('./server/database/connection')
const app=express()

dotenv.config({path:"config.env"});

const PORT=process.env.PORT||8080



//log requests
app.use(morgan('tiny'))

//mongodb connection

app.use(nocashe())

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1800000 // 30 minutes in milliseconds
  }
}));



app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs')
// app.set('views',path.resolve(__dirname,"views/ejs"))

function check_session(req,res,next){
  if(req.session.authorized){
    next()
  }else{
    res.render('register');
}
}

 
// GET request for single file


app.get('/',check_session,(req,res)=>{
  res.render('home',{name});
})

app.get('/login', (req, res) => {
  res.render('login',  {messages: 'hai'});
});

app.get('/admin',check_session,async(req,res)=>{
  const data=await UserDb.find()
  console.log(data);
  res.render('index',{users:data})
 
})

app.get('/logout',(req,res)=>{
  req.session.destroy()
  console.log(req.session);
  res.render('login');

})


app.post('/', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const gender =req.body.gender;
  const status = req.body.status;
  const password = req.body.password;
  

  try {

   
    const existingUser = await UserDb.findOne({ email: email });

    if (existingUser) {
      return res.render('register', { name: 'Alredy exits' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserDb({
      name: name,
      email: email,
      gender:gender,
      status:status,
      password: hashedPassword
    });
 
    await newUser.save();

    req.session.admin=email
    req.session.authorized=true
   

    res.render('login', { messages: 'hai' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
  
app.post('/admin', async (req, res) => {
  const email = req.body.email;
 
  const password = req.body.password;

  req.session.admin = email;
  req.session.authorized = true;

  try {
    const user = await UserDb.findOne({ email: email });
    

    if (!user) {
      res.render("register", { alert: "Invalid entry" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      if (req.body.email === 'admin123@gmail.com') {
        req.session.admin = email;
        req.session.authorized = true;
        res.redirect('/admin');
      } else {
        req.session.admin = email;
        req.session.authorized = true;
        res.redirect('/');
      }
    } else {
      res.render("login", { message: "Invalid entry" });
    }
  } catch (error) {
    console.error(error);
    res.send('An error occurred while logging in.');
  }
});

  
app.get('/search',check_session, (req, res) => {
    const query = req.query.name; // Get the search query from the URL query parameters
  
    // Perform the search using Mongoose
    UserDb.find({ name: { $regex: new RegExp(query, 'i') } })
      .then(users => {
        res.render('index', { users });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  });

  
  




  
  

// load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

app.use('/',require('./server/routes/routes'))



app.listen(3000,()=>{
    console.log("Server is running");
})