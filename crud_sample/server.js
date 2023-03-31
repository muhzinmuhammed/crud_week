const express=require('express')
const dotenv=require('dotenv')
const morgan=require('morgan')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const path=require('path')
const bcrypt=require('bcrypt')
var UserDb=require('./server/model/model')
// const connectDB=require('./server/database/connection')
const app=express()

dotenv.config({path:"config.env"});

const PORT=process.env.PORT||8080


mongoose.connect('mongodb://127.0.0.1:27017/users');
//log requests
app.use(morgan('tiny'))

//mongodb connection





app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs')
// app.set('views',path.resolve(__dirname,"views/ejs"))

app.post('/', (req, res) => {
  if (req.body.email=='admin123@gmail.com') {

    res.render('index', {users: 'users'});
    
  }else{

    res.render('home', {name: 'users'});

  }
 
});

app.get('/register', (req, res) => {
  res.render('register', {messages:'users'});
});

app.get('/login', (req, res) => {
  res.render('login', {messages: 'users'});
});

app.post('/register', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;
  const status = req.body.status;

  try {
    const existingUser = await UserDb.findOne({ email: email });

    if (existingUser) {
      return res.render('login', { name: 'muhzin' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserDb({
      name: name,
      email: email,
      gender: gender,
      status: status,
      password: hashedPassword,
     
    });

    await newUser.save();

    res.render('login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});
  
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await UserDb.findOne({ email: email });

    if (!user) {
      return res.send('Incorrect email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.render('index', { users:'users' });
    } else {
      res.send('Incorrect email or password.');
    }
  } catch (error) {
    console.error(error);
    res.send('An error occurred while logging in.');
  }
});

  


  
app.get('/search', (req, res) => {
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