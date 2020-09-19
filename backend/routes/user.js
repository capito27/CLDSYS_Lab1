const express = require('express');
const mongodb = require("mongodb");
const router = express.Router();
const userMiddleware = require('./middlewares.js').userMiddleware;
const getPostMiddleware = require('./middlewares.js').getPostMiddleware;
const {Connection} = require('../database/Connection.js');

router.use(userMiddleware);

router.get('/user',
    (req, res) => {
        delete req.user.password;
        delete req.user.__v;
        res.status(200).end(JSON.stringify(req.user));
    });

router.get("/logout",
    (req, res) => {
        res.clearCookie('x-auth');

        res.status(200).end('OK');
    });

router.get("/outbox",
    (req, res) => {
        Connection.db.collection('mails')
            .find({author: req.user._id}, {
                _id: 1,
                author: 1,
                recipient: 1,
                subject: 1,
                read: 1,
                date: 1
            }).sort({date: -1}).toArray(function (err, mails) {
            res.status(200).end(JSON.stringify(mails))
        });
    });

router.get("/inbox",
    (req, res) => {
        Connection.db.collection('mails')
            .find({recipient: req.user._id}, {
                _id: 1,
                author: 1,
                recipient: 1,
                subject: 1,
                read: 1,
                date: 1
            }).sort({date: -1}).toArray(function (err, mails) {
            res.status(200).end(JSON.stringify(mails))
        });
    });

router.get("/mail/:id",
    (req, res) => {
        const id = new mongodb.ObjectId(req.params.id);
        Connection.db.collection('mails')
            .findOne({_id: id}, function (err, mail) {
                if (err || !mail)
                    res.status(500).end(err);
                else {
                    if (mail && mail.recipient.toString() === req.user._id.toString()) {
                        Connection.db.collection('mails')
                            .findOneAndUpdate({_id: id}, {$set: {read: true}}, {returnOriginal: false}, function (err, mail) {
                                if (err)
                                    res.status(500).end(err.toString());
                                else
                                    res.status(200).end(JSON.stringify(mail.value));

                            })
                    } else
                        res.status(200).end(JSON.stringify(mail));
                }
            });
    });

router.post('/mail/send',
    getPostMiddleware(['recipient', 'subject', 'content']),
    (req, res) => {
        Connection.db.collection('mails').insertOne({
            author: req.user._id,
            recipient: new mongodb.ObjectId(req.body.recipient),
            subject: req.body.subject,
            read: false,
            content: req.body.content,
            date: Date.now()
        }, function (err, result) {
            if (err)
                res.status(500).send('Internal error');
            else
                res.status(200).send('OK')
        });
    });

router.get('/users',
    (req, res) => {
        Connection.db.collection('users')
            .find({}).project({_id: 1, username: 1, firstname: 1, lastname: 1, admin: 1, active: 1, membersince: 1})
            .toArray(function (err, users) {
                if (err)
                    res.status(500).end('Internal error.');
                else
                    res.status(200).end(JSON.stringify(users));
            });
    });

router.post('/user/edit',
    getPostMiddleware(['firstname', 'lastname', 'password']),
    (req, res) => {
        Connection.db.collection('users').updateOne({_id: new mongodb.ObjectId(req.user._id)},
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    password: req.body.password
                }
            }, function (err) {
                if (err)
                    res.status(500).send('Internal error');
                else
                    res.status(200).send('Password successfully edited.');
            })
    });

router.delete('/mail/:id',
    (req, res) => {
    Connection.db.collection('mails').deleteOne({_id: new mongodb.ObjectId(req.params.id), recipient: new mongodb.ObjectId(req.user._id)}, function (err) {
        if (err)
            res.status(500).end(err.toString());
        else
            res.status(200).end("Mail successfuly deleted.");
    });
});

module.exports = router;