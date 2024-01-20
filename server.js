const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/userModel');

const dbURI = 'mongodb+srv://tahmeedhm:test123@cluster0.ygqkaon.mongodb.net/?retryWrites=true&w=majority';

const app = express();
const port = 3000;

const faviconPath = path.join(__dirname, 'favicon.ico');
app.use(favicon(faviconPath));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at Port:${port}`);
        });
    })
    .catch(error => {
        console.error('Error connecting to the database:', error);
    });


app.post('/sreq', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let skill = req.body.skill;
    try {
        let temp = await User.create({ username, password, skill , logedin: true});
        res.json({ status: 'success' });
    } catch (e) {
        console.error('Error creating user:', e);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

app.post('/lreq', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const userdata = await User.find();

        userdata.forEach(user => {
            if (user.username == username) {
                if (user.password == password) {
                    User.updateOne({ _id: user._id }, { $set: { logedin: true } })
                    .then(r => {
                         res.json({ status:'success' });
 
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                        res.status(500).send('Internal Server Error');
                    });
                    
                } else {
                    
                }
            }
        });

    } catch (e) {
        console.error('Error fetching user data:', e);
        res.status(500).json('Error');
    }
});

app.get('/', (req, res) => {
    User.find()
        .then((userdata) => {
            res.render('home', { userdata });
        })
        .catch(error => {
            console.error('Error fetching user data for home page:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/', (req, res) => {
    res.redirect('/');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId)
        .then(user => {
            if (!user) {
                res.status(404).send('User not found');
                return;
            }
            res.render('details', { user });
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            res.status(500).send('Internal Server Error');
        });
});
app.delete('/:id', (req, res) => {
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
        .then(user => {
            
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            res.status(500).send('Internal Server Error');
        });
})

app.post('/:id', (req, res) => {
    const userId = req.params.id;
    User.updateOne({ _id: userId }, { $set: { logedin: false } })
        .then(r => {
            
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            res.status(500).send('Internal Server Error');
        });
})
