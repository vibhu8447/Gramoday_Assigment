
const express = require('express');
const app=express();
const uuid = require('uuid');
const mongoose= require('mongoose');
const ReportModel= require('./models/Report');

require("dotenv").config();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({extended: true})); 


(function ConnectToDB(){   
   const uri = process.env.DB_CONNECTION_STRING;
    mongoose.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true})
     .then(() => console.log("Database connected!"))
     .catch(err => console.log(err));
})();


//  to post the reports
app.post('/reports',function (req,res){
    var avgPrice  ;
  
    ReportModel.findOne({cmdtyID:`${req.body.reportDetails.cmdtyID}`,marketID:`${req.body.reportDetails.marketID}` })
    .then((result)=>{
        avgPrice=(result.price+(req.body.reportDetails.price/req.body.reportDetails.convFctr))/2;
        
        ReportModel.updateOne({_id:`${result._id}`},{$set:{price:avgPrice,users:[...result.users,req.body.reportDetails.userID]}})
        .then(()=>{
            console.log(res);
            res.send({
                "status": "success",
                "reportID":result._id
            });
        })
        .catch((err)=>{
            res.status(401).send({
                "status":"failed",
                "message":"error in updating"
            });
        })
      
    }).catch((err)=>{
        var totalPrice=req.body.reportDetails.price;
        var convFctr=req.body.reportDetails.convFctr;
        var user=req.body.reportDetails.userID;
        var pricePerPeace=totalPrice/convFctr;
        var Unit;
        if(req.body.reportDetails.priceUnit=='Pack')
            Unit="Kg";
        const report = new ReportModel({...req.body.reportDetails,_id:uuid.v4(),price:pricePerPeace,users:[user],priceUnit:Unit});
            try {
                report.save();
                res.send({status:"success",reportID:report._id});
            } catch (error) {
                res.status(500).send(error);
            }
    }) 

    

})

// to get the aggregated report
app.get('/reports',function(req,res){
    console.log(req.query);
    ReportModel.find({_id:`${req.query.reportID}`}).then((result)=>{
        res.status(200).send(result);
    }).catch((err)=>{
        res.status(404).send(err);
    }) 
})

app.listen(3000,function(){
    console.log("runnig on Port 30000",);
})