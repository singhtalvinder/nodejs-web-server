const express = require('express');
const hbs = require('hbs');

const fs = require('fs');

// get the port set by heroku as env variable,
//  else set it to default of 3000 to test on localhost.
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

// set view engine to hbs 
app.set('view engine', 'hbs');

// Registry a middle ware: 
app.use((req, res, next) =>{
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log +'\n', (err) =>{
        if(err) {
            console.log('Unable to append to log file.');
        }
    });
    // Generally when we sue async calls. 
    //next is to tell express when middleware function is done.
    next();
});

/*
app.use((req,res,next) => {
    res.render('maintenance.hbs');
});*/

// Registry a middle ware: reading from a static directory
app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', ()=> {
    return new Date().getFullYear();
});

hbs.registerHelper('convertToUpper', (Text)=> {
    return Text.toUpperCase();
} )

app.get('/', (req, res)=> {// request , response
//res.send('<h1>Hello Express !!</h1>');
res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
    });
});

/* // replace with hbs 
res.send({
    name: 'Talvinder',
    likes: [
        'cycling',
        'music'
    ]
    });*/

app.get('/about', (req,res)=>{
    //res.send('About Page'); //replace with hbs render
    res.render('about.hbs',{
        pageTitle: 'About page'
        
    });
});

app.get('/bad', (req,res) => {
    res.send({
        err: 'Bad Page',
        reason: [
            'not available',
            'internet error',
            'internal error',
            'bad request'
        ]
    });
});


// keep a dynamic port variable that heroku will set.
app.listen(port, ()=> {
    console.log(`Server is up at Port ${port}`);
}); // port to bind , for local host ,we use 3000 generally.

