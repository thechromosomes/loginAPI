const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const googleAuth = require('./routes/api/goolge-auth')


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());



// HOME route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
    });
    
  // Profile controller  
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userProfile.html'))
    });   

  //routers
app.use('/api/user', users);
app.use('/api/user/profile', profile);
app.use('/api/user/google', googleAuth);


// port config
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port} `));
