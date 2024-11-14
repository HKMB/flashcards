const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

// Route to handle the main page, which renders `index.pug` if `name` exists or `hello.pug` otherwise
app.get('/', (req, res) => {
    const name = req.cookies.username || null;
    if (name) {
        // Render `index.pug` with `name` and showWelcome set to false
        res.render('index', { name, showWelcome: false });
    } else {
        // Render `hello.pug` if no `name` is present
        res.render('hello');
    }
});

// Route to handle the "Begin" button click, setting `showWelcome` to true in `index.pug`
app.get('/welcome', (req, res) => {
    const name = req.cookies.username || null;
    if (name) {
        res.render('index', { name, showWelcome: true });
    } else {
        res.redirect('/'); // Redirect to main page if no name is set
    }
});

// Route to handle form submission from `hello.pug` to set the `username` cookie
app.post('/hello', (req, res) => {
    const name = req.body.username;
    res.cookie('username', name); // Set the username cookie
    res.redirect('/'); // Redirect to main page to render `index.pug`
});

// Route to handle logout, clears the `username` cookie and redirects to `hello.pug`
app.post('/goodbye', (req, res) => {
    res.clearCookie('username'); // Clear the `username` cookie
    res.redirect('/hello'); // Redirect to `hello.pug`
});

// Other routes
const mainRoutes = require('./routes');
const cardRoutes = require('./routes/cards');

app.use(mainRoutes);
app.use('/cards', cardRoutes);

// 404 handler for unknown routes
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// General error handler
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.render('error');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});