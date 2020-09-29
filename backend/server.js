const path = require('path');
const express = require('express');
const mongodb = require('mongodb');
const app = express();
const defaultRouter = require('./routes/default.js');
const userRouter = require('./routes/user.js');
const adminRouter = require('./routes/admin.js');
const {Connection} = require('./database/Connection.js');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());
app.use('/', defaultRouter);
app.use('/', userRouter);
app.use('/admin', adminRouter);

const port = process.env.BACKEND_PORT || 3000;

Connection.connectToMongo().then(() => {
        Connection.db.collection('users').update({_id: new mongodb.ObjectId('5d9af2e377d89502c30471d8')},
            {
                username: "admin",
                password: "admin",
                firstname: "Admin",
                lastname: "Istrateur",
                active: true,
                admin: true,
                membersince: Date.now()
            },
            {upsert: true});
        app.listen(port, () => console.log('Server running...'));
        });
