// declare imports required for the server
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth'); 
require('dotenv').config();

// importing graphQL typeDefs and resolvers to use for the server and db connection to mongoDB
const { typeDefs, resolvers } = require('./schemas'); 
const db = require('./config/connection'); 

// tell our server to use localhost port or the environment port in production
const PORT = process.env.PORT || 9001; 
const app = express();

// setup apollo server, pass in schema, start server, and tell express to listen to the server
const startServer = async() => {
    // create new apollo server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: authMiddleware
    });

    await server.start();

    server.applyMiddleware({ app });

    console.log(`GraphQL is being used on http://localhost:${PORT}${server.graphqlPath}! (~_~)7`);
}

// initialize apollo server
startServer();

// configure middleware for express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// tell app where to get files from in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// wildcard route to server assets from react front end
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '../client/build/indext.html'));
});

// launch server once db connection is opened
db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`API server is running on port ${PORT}! (^^)b`)
    });
});