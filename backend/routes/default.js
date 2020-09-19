const express = require('express');
const router = express.Router();
const db = require('../server.js');
const token = require("../auth/token.js");
const {Connection} = require('../database/Connection.js');

router.use(express.static('/frontend/dist'));

router.post('/login',
    (req, res) => {
        Connection.db.collection('users')
            .findOne({username: req.body.username}, {_id: 1, password: 1}, function (err, user) {
                if (err)
                    res.status(500).send('Internal error');
                else if(!user) {
                    res.status(400).send('Wrong username');
                } else {
                    if (user.password === req.body.password && user.active) {
                        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
                        res.cookie('x-auth', token.generateToken(user._id, expires).toString(), {
                            encode: String,
                            expires
                        }); // 24 hours
                        res.status(200).end(token.generateToken(user._id, expires));
                    } else {
                        res.status(403).end("Wrong credentials.");
                    }
                }
            });
    });

module.exports = router;