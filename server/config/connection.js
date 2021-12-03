const mongoose = require('mongoose');
// connect to mongoose and mongoDB using either local machine or the DB service on Mongo Atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/calorie-converter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = mongoose.connection; 
