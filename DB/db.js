const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to MongoDB successful');
}).catch((err) => {
    console.log('Connection to MongoDB failed');
});
