const mongoose = require('mongoose');


const bcrypt = require('bcrypt')
saltRounds = 5;


const userSchema = new mongoose.Schema({
    username:{type:String, required:true},
    password:{type:String, required:true},
    recentSocketId:{type:String, required:true}
})

const User = new mongoose.model("User", userSchema);


//registration part
bcrypt.hash('req.body.password' , saltRounds, function(err, hash) {
    const newUser = new User({
        username:req.body.username,
        password:hash,
        recentSocketId:putSomeSocket
    });
    console.log(req.body.password)
    console.log(hash);

    newUser.save((err)=>{
        if (err){
            console.log(err);
        } else {
            console.log('user logged in successfully');
        }
    })
});


// login part
const username = req.body.username;
const password = req.body.password;



User.findOne({email:username},(err,foundUser)=>{
    if (err){
        console.log(err);
    } else {
        if(foundUser){
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result == true){
                    res.render("secrets")
                }
            });
        }
    }
})