const mongoose = require('mongoose')

module.exports = () =>{
    const correctionParams = {
        useNewUrlParser: true,
        useNewUnifiedTopology: true
    };
    try{
        mongoose.connect(process.env.DB_URL , connectedParams);
        console.log('Connected to Database')
    } catch(error){
        console.log('Could not connect to DB due to:' + error)
    }
}