// import jwt to use for encoding user data and passing into context for authentication
const { runHttpQuery } = require('apollo-server-core');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// grab token secret and expiration from environment variables
const secret = process.env.TOKEN_SECRET;
const expiration = process.env.TOKEN_EXPIRATION; 

// export signToken and authMiddleware functions
module.exports = {
    // signToken will encrypt the passed in user data to a jwt
    signToken: function({ username, email, _id }) {
        return jwt.sign({ data: { username, email, _id }}, secret, {expiresIn: expiration}); 
    },
    // authMiddleware will intercept requests to the server via apollo context and add the user information to the request if a token exists 
    authMiddleware: function({ req }) {
        // Grab token from the authorization header in the request
        let token = req.headers.authorization;

        if(token) {
            // token will pass in as 'Bearer token', we split to produce ['Bearer','token'], pop will return 'token', then we remove any whitespace with trim()
            token = token.split(' ').pop().trim();
        } else {
            // if no token, return the request with no modifications
            return req; 
        }

        // try...catch to prevent errors from showing when there is not a token in the request
        try {
            // decode token into user information and pass it with the rest of the request to the resolvers
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data; 
        } catch {
            console.log('Invalid token');
        }
    }
};