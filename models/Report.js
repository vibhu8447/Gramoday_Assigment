const mongoose =  require('mongoose');

const report = new mongoose.Schema({
    _id:{
        type:String,
        require:true
    },
    cmdtyName:{
        type:String,
        required:true
    },
    cmdtyID:{
        type:String,
        required:true
    },
    marketID:{
        type:String,
        required:true
    },
    marketName:{
        type:String,
        required:true
    },
    users:{
        type:Array,
        default:[]
    },


    priceUnit:{
        type:String,
        required:true
    },
    convFctr:{
        type:Number,
        required:false
    },
    price:{
        type:Number,
        required:true
    },
    
},{timestamps:true}); 
module.exports = mongoose.model('report',report);