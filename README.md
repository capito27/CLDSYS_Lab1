# CLDSYS_Labo1

Quickstart instructions : 
1. npm install both the backend and frontend projects
2. Edit the mongoDB url + credentials in `backend/database/Connection.js` OR set the `MONGODB_URI` env. variable
3. Edit the backoffice API port in `backend/server.js` OR set the `BACKEND_PORT` env. variable
4. Edit the backoffice API url in `frontend/vue.config.js` OR set the `BACKEND_URI` env. variable
5. Optionally set the `$FRONTEND_PORT` env. variable to change the listen port of the frontend (3000 default)
6. start the mongoDB database
7. start the backend module with `npm run start` in the backend directory
8. start the frontend module with `npm run serve` in the frontend directory
9. use the default credentials `admin:admin`

