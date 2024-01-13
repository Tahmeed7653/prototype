const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const User = require('./models/userModel');


const exportContent = {
    username: 'User not found',
    title: 'API',
};

// const userdata = [
//     { username: 'Tahmeed', skill: 'Back-End-Dev' },
//     { username: 'John', skill: 'Front-End-Dev' },
//     { username: 'Smith', skill: 'Full-Stack-Dev' },
//     { username: 'Alex', skill: 'Database-Admin' },
//     { username: 'Eva', skill: 'UI/UX-Designer' },
//     { username: 'Max', skill: 'DevOps-Engineer' },
//     { username: 'Lee', skill: 'Mobile-App-Developer' },
//     // Add more objects as needed
// ];

const userdata = [
    {
        username: '',
        password: '', 
        skill: ''   
    }
        // Add more objects as needed
    ];


userdata.forEach(item => {
    item.username = item.username.toUpperCase();
});


const dbURI ='mongodb+srv://tahmeedhm:test123@cluster0.ygqkaon.mongodb.net/?retryWrites=true&w=majority';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());



mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((result) => {
    app.listen(port, () => {
        console.log(`Server is running at Port:${port}`);
    });
})


app.post('/backend-api-endpoint', async (req, res) => {
    let username = req.body.username.toUpperCase();
    let password = req.body.password;
    let skill = req.body.skill;
    userdata.push({ username,password, skill });
    try{
        const userDB = await User.create({username,password,skill})
        console.log(userDB)
    }catch(e){
        console.log(e)
    }
    
    console.log(username);
    
    console.log(userdata);
    res.json({ status: 'success' });
});

app.get('/', (req, res) => {
    exportContent.username = userdata[0].username;
    res.render('home', {exportContent,userdata});
});

app.post('/', (req, res) => {
    // get the message using socket
    res.redirect('/');
    // Redirect the user to the home page or perform any other necessary actions
});

app.get('/signup', (req, res) => {
    res.render('form', exportContent);
});

app.get('/:id', (req, res) => {
    const userId = req.params.id;
    const foundUser = userdata.find(user => user.username === userId.toUpperCase());

    if (foundUser) {
        exportContent.username = foundUser.username.charAt(0).toUpperCase() + foundUser.username.slice(1).toLowerCase();
    } else {
        exportContent.username = 'User currently not available';
    }

    res.render('index', exportContent);
});

