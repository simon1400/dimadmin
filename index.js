const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const keys = require('./config/keys');

require('./models/User');
require('./models/Projects');
require('./models/Menu');
require('./models/Social');

mongoose.connect(keys.mongoURI, { autoIndex: false });

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(fileUpload());

require('./routes/authRoutes')(app);
require('./routes/articlesRoutes')(app);
require('./routes/menuRoutes')(app);
require('./routes/socialRoutes')(app);
require('./routes/imageRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    const path = require('path'); //We need path earlier for this!
    app.use(express.static(path.join(__dirname, '/client/build')));
    //No more changes from here on now
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT);
