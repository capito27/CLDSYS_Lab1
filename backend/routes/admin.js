const express = require('express');
const mongodb = require("mongodb");
const router = express.Router();
const {Connection} = require('../database/Connection.js');
const userMiddleware = require('./middlewares.js').userMiddleware;
const adminMiddleware = require('./middlewares.js').adminMiddleware;
const getPostMiddleware = require('./middlewares.js').getPostMiddleware;
const checkUsernameMiddleware = require('./middlewares.js').checkUsernameMiddleware;

router.use(userMiddleware, adminMiddleware);

router.post('/user/new',
    getPostMiddleware(['username', 'password', 'firstname', 'lastname', 'admin', 'active']),
    checkUsernameMiddleware,
    (req, res) => {
        Connection.db.collection('users').insertOne({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            active: req.body.active,
            admin: req.body.admin,
            membersince: Date.now()
        }, function (err, newUser) {
            if (err) {
                res.status(500).send('Internal error');
                return;
            }
            res.status(200).send(newUser.ops[0]._id.toString());
        })
    });

router.post('/user/:id/edit',
    getPostMiddleware(['admin', 'active', 'firstname', 'lastname', 'username']),
    checkUsernameMiddleware,
    (req, res) => {
        console.log(req);
        Connection.db.collection('users').updateOne({_id: new mongodb.ObjectId(req.params.id)},
            {
                $set: {
                    username: req.body.username,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    active: req.body.active,
                    admin: req.body.admin
                }
            }, function (err) {
                if (err)
                    res.status(500).send(err);
                else
                    res.status(200).send('User successfully edited.');
            })
    });

router.delete('/user/:id',
    (req, res) => {
        Connection.db.collection('users').deleteOne({_id: new mongodb.ObjectId(req.params.id)}, function (err) {
            if (err)
                res.status(500).send('Internal error');
            else
                res.status(200).send('User successfully deleted.');
        })
    });

module.exports = router;