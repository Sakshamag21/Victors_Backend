const mongoose = require("mongoose");

 const DB = process.env.DATABASE
// const DB ="mongodb+srv://Sakshamag21:saksham9927@cluster0.pw6yg63.mongodb.net/mernstack?retryWrites=true&w=majority"

console.log(DB)
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log("connection start")).catch((error)=> console.log(error.message));