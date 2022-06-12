const { response } = require("express");
const express = require("express");
const req = require("express/lib/request");
const { DATE } = require("mysql/lib/protocol/constants/types");
const db= require("../dbconfig")

var app = express.Router({ mergeParams: true });

app.get("/productList", (req,res)=>{
    var sql ="SELECT * FROM prod_list";
    db.query(sql, function(error, results, fields) {
        res.render('table', {fields:fields, title: "Product List", results:results});
    });
});

app.get("/partyList", (req,res)=>{
    var sql ="SELECT * FROM party";
    db.query(sql, function(error, results, fields) {
        res.render('table', {fields:fields, title: "Party List", results:results});
    });
});

app.get("/stocks", (req,res)=>{
    var sql ="SELECT * FROM stock";
    db.query(sql, function(error, results, fields) {
        
        res.render('table', {fields:fields, title: "Stocks", results:results});
        //res.send(results);
    });
});

app.get("/shiftHistory", (req,res)=>{
    var username= req.session.username;
    var sql = "SELECT * FROM empworkhours WHERE  month(SDATE) = month(current_date()) AND EMP_ID='"+username+"';"
    db.query(sql, function(error, results, fields){
        res.render('table', {fields:fields, title: "Shift History", results:results});
    });
});

app.get("/salesHistory", (req, res)=>{
    var username= req.session.username;
    var username= req.session.username;
    var sql = "SELECT * FROM sales WHERE  month(SELL_DATE) = month(current_date()) AND EMP_ID='"+username+"';"
    
    db.query(sql, function(error, results, fields){
        results.forEach(function(row){
            row.SELL_DATE= row.SELL_DATE.toDateString();
        });
        res.render('table', {fields:fields, title: "Sales History", results:results});
    
    });
});

app.get("/saleForm",(req,res)=>{
 var fields= [
   {name:"ProdID", type:"text", placeholder:"Enter Product ID"}, 
   {name:"ProdType", type:"text", placeholder:"Enter Product Type"}, 
   {name:"PartyID", type:"text", placeholder:"Enter Party ID"}, 
   {name:"amount", type:"number", placeholder:"Enter amount"}
 ];
 var action="/sperson/saleForm";
res.render('form', {title:"Sales Form", action:action, fields:fields});
});

app.post("/saleForm", (req,res)=>{
    var username=req.session.username;
    var prod_id= req.body.ProdID;
    var prod_type= req.body.ProdType;
    var party_id= req.body.PartyID;
    var amount= req.body.amount;

    var sql="SELECT check_Stock('"+prod_id+"', '"+prod_type+"', "+amount+") as Stock;"
    console.log(sql);
    db.query(sql, function(error, results, fields){
        if (error)console.error(error);
        console.log(results[0].Stock);
        if (results[0].Stock==0)res.send("Not enough stock available");
        else {
            var sql= "call make_sale('"+prod_id+"', '"+prod_type+"', "+amount+", '"+username+"','"+party_id+"');"
            db.query(sql, function(error, results, fields){
                if (error)  console.error(error);
                else res.redirect('/sperson/salesHistory');
        
            });
        }
    });
   
});

module.exports = app;