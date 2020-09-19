const token = require('../auth/token.js');
const mongodb = require('mongodb');
const {Connection} = require('../database/Connection.js');

async function isTokenValid(req, res, next) {
    if (!req.cookies['x-auth']) {
        res.status(401).send('Unauthorized');
        return;
    }

    const tokenData = token.unpackToken(req.cookies['x-auth']);

    if (!tokenData.isValid)
        res.status(401).send('Unauthorized');

    Connection.db.collection('users')
        .findOne({_id: new mongodb.ObjectId(tokenData.id)}, {
            _id: 1,
            username: 1,
            firstname: 1,
            lastname: 1,
            active: 1,
            admin: 1,
            membersince: 1
        }, function (err, user) {
            if (err)
                res.status(500).send('Internal error');
            else {
                if (tokenData.isValid && !!user && user.active) {
                    req.user = user;
                    next();
                } else {
                    res.status(401).send('Unauthorized');
                }
            }
        });
}

function isAdmin(req, res, next) {
    if (!req.user.admin) {
        res.status(401).send('Unauthorized');
        return;
    }

    next();
}

function getMandatoryParamsChecker(params) {
    return function (req, res, next) {
        for (let param of params) {
            if (req.body[param] === undefined) {
                res.status(400).send('Missing mandatory information: ' + param.toString());
                return;
            }
        }

        next();
    }
}

function checkUsernameMiddleware(req, res, next) {
    Connection.db.collection('users').countDocuments({_id: {$ne: new mongodb.ObjectId(req.params.id)}, username: req.body.username}, {limit: 1}, (err, result) => {
        if (!result)
            next();
        else
                res.status(500).send('Username "' + req.body.username.toString() + '" already exists.');
    });


}

module.exports = {
    userMiddleware: isTokenValid,
    adminMiddleware: isAdmin,
    getPostMiddleware: getMandatoryParamsChecker,
    checkUsernameMiddleware
};