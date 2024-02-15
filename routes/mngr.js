const express = require("express");
const db= require("../dbconfig")
var app = express.Router({ mergeParams: true });

app.get("/", (req, res) => {
  var fields= [
    {name:"Stocks", link:"/mngr/stocks"}, 
    {name:"Sales",  link:"/mngr/salesHistory"},
    {name:"Add Stocks", link:"/mngr/addStock"}, 
    {name:"Add Sale",  link:"/mngr/saleForm"},
    {name:"Shift History", link:"/mngr/shiftHistory"}, 
    {name:"Party List",  link:"/mngr/partyList"},
    {name:"Product List",  link:"/mngr/productList"}
  ];
res.render('dashboard', {title:"Salesman Dashboard", fields:fields});  

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

app.get("/addSalesman", (req, res) => {
  var fields = [
    { name: "Emp_ID", type: "text", placeholder: "Enter Employee ID" },
    { name: "Emp_Name", type: "text", placeholder: "Enter Employee Name" },
    {
      name: "Emp_Pass",
      type: "password",
      placeholder: "Enter Employee Password",
    },
    { name: "Emp_contact", type: "text", placeholder: "Enter Contact No" },
    { name: "Emp_HrRate", type: "number", placeholder: "Enter Hourly Rate" },
    { name: "Emp_CNIC", type: "text", placeholder: "Enter Employee CNIC" },
  ];
  var action = "/mngr/addSalesman";
  res.render("form", { title: "Add Salesman", action: action, fields: fields });
});
app.post("/addSalesman", (req, res) => {
  var empID = req.body.Emp_ID;
  var empName = req.body.Emp_Name;
  var empPass = req.body.Emp_Pass;
  var empContact = req.body.Emp_contact;
  var empHrrate = req.body.Emp_HrRate;
  var empCnic = req.body.Emp_CNIC;

  var sql =
    "INSERT INTO employee VALUES('" +
    empID +
    "','" +
    empName +
    "','" +
    empPass +
    "','" +
    empContact +
    "'," +
    empHrrate +
    ",'SLSMN','" +
    empCnic +
    "');";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    res.redirect("/mngr/salesmen");
  });
});

app.get("/salesmen", (req, res) => {
  var sql = "SELECT * FROM employee WHERE EMP_TYPE= 'SLSMN';";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    res.render("table", {
      fields: fields,
      title: "Salesmen",
      results: results,
    });
  });
});

app.get("/sales", (req, res) => {
  var sql = "SELECT * FROM sales WHERE 1;";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    res.render("table", { fields: fields, title: "Sales", results: results });
  });
});

app.get("/stocks", (req, res) => {
  var sql = "SELECT * FROM stock WHERE 1;";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    res.render("table", { fields: fields, title: "Stock", results: results });
  });
});

app.get("/stockHisory", (req, res) => {
  var sql = "SELECT * FROM stock WHERE 1;";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    res.render("table", {
      fields: fields,
      title: "Stock History",
      results: results,
    });
  });
});

app.get("/saleForm", (req, res) => {
  var fields = [
    { name: "ProdID", type: "text", placeholder: "Enter Product ID" },
    { name: "ProdType", type: "text", placeholder: "Enter Product Type" },
    { name: "PartyID", type: "text", placeholder: "Enter Party ID" },
    { name: "amount", type: "number", placeholder: "Enter amount" },
  ];
  var action = "/mngr/saleForm";
  res.render("form", { title: "Sales Form", action: action, fields: fields });
});

app.post("/saleForm", (req, res) => {
  var username = req.session.username;
  var prod_id = req.body.ProdID;
  var prod_type = req.body.ProdType;
  var party_id = req.body.PartyID;
  var amount = req.body.amount;

  var sql =
    "SELECT check_Stock('" +
    prod_id +
    "', '" +
    prod_type +
    "', " +
    amount +
    ") as Stock;";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    console.log(results[0].Stock);
    if (results[0].Stock == 0) res.send("Not enough stock available");
    else {
      var sql =
        "call make_sale('" +
        prod_id +
        "', '" +
        prod_type +
        "', " +
        amount +
        ", '" +
        username +
        "','" +
        party_id +
        "');";
      db.query(sql, function (error, results, fields) {
        if (error) console.error(error);
        else res.redirect("/mngr/salesHistory");
      });
    }
  });
});

app.get("/addStock", (req, res) => {
  var fields = [
    { name: "ProdID", type: "text", placeholder: "Enter Product ID" },
    { name: "ProdType", type: "text", placeholder: "Enter Product Type" },
    { name: "amount", type: "number", placeholder: "Enter amount" },
  ];
  var action = "/mngr/addStock";
  res.render("form", { title: "Add Stock", action: action, fields: fields });
});
app.post("/addStock", (req, res) => {
  var prod_id = req.body.ProdID;
  var prod_type = req.body.ProdType;
  var amount = req.body.amount;

  var sql =
    "CALL add_Stock('" + prod_id + "', '" + prod_type + "', " + amount + ");";
  console.log(sql);
  db.query(sql, function (error, results, fields) {
    if (error) console.error(error);
    console.log(results[0].Stock);
  });
});

module.exports = app;
