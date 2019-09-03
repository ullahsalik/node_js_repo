var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

// New user registration
router.post('/signup', function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        },
        function (err, user) {
            if (err) return res.status(500).send("There is a problem adding the user to the database.");
            res.status(200).send(user);
        });
});


// GETS A SINGLE USER FROM THE DATABASE
router.get('/login', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
        if (req.path === '/users/authenticate') {
                return next();
            }

            // check for basic auth header
            if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
                return res.status(401).json({ message: 'Missing Authorization Header' });
            }

            // verify auth credentials
            const base64Credentials =  req.headers.authorization.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [username, password] = credentials.split(':');
            const user = await userService.authenticate({ username, password });
            if (!user) {
                return res.status(401).json({ message: 'Invalid Authentication Credentials' });
            }

            // attach user to request object
            req.user = user

            next();

        function authenticate({ username, password }) {
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
        }

    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});


module.exports = router;
