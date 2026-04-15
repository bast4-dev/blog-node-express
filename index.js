const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret: 'mon-secret-blog',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Variables globales pour les templates
app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    next();
});

// MongoDB
mongoose
    .connect('mongodb://127.0.0.1/my_blog')
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.log('Connection failed', err));

// Middleware de validation pour la création de post
const validateMiddleware = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.body == null) {
        return res.redirect('/post/new');
    }
    next();
};

// Controllers
const getHomePage = require('./src/controllers/getHomePage');
const getNewPost = require('./src/controllers/getNewPost');
const storePost = require('./src/controllers/storePost');
const getPost = require('./src/controllers/getPost');
const newUser = require('./src/controllers/newUser');
const storeUser = require('./src/controllers/storeUser');
const loginPage = require('./src/controllers/loginPage');
const loginUser = require('./src/controllers/loginUser');
const logoutUser = require('./src/controllers/logoutUser');

// Routes
app.get('/', getHomePage);
app.get('/post/new', getNewPost);
app.post('/post/store', validateMiddleware, storePost);
app.get('/post/:id', getPost);

app.get('/auth/register', newUser);
app.post('/auth/register', storeUser);
app.get('/users/login', loginPage);
app.post('/users/login', loginUser);
app.get('/auth/logout', logoutUser);

// 404
app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});