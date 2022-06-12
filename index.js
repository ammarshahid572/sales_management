var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');



var salesRouter= require('./routes/salesman');
var mngrRouter = require('./routes/mngr');
var adminRouter = require('./routes/admin');
var bodyParser = require('body-parser');
var db=require('./dbconfig');
const req = require('express/lib/request');

var app = express();
// view engine setup
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/logout', function(request, response){
	
    //record logout 
    request.session.username="none";
	request.session.loggedin=false;
	response.redirect('/');
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});


app.post('/login', function(request, response) {    
	var username = request.body.username;
	var password = request.body.password;
    //console.log(username);
    	if (username && password) {
        var sql= "SELECT EMP_TYPE FROM employee WHERE  EMP_ID = '"+username+"' AND EMP_PASS = '"+password+"';";
		db.query(sql, function(error, results, fields) {
            //console.log(results);
            //console.log(sql);
            if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				
				results.forEach( function (data){
					if (data.EMP_TYPE=="mngr")
					response.redirect('/mngr/');
					else if (data.user_type=="admin")
					response.redirect('/admin/');
					else {
						response.redirect('/sperson/');
					}
				});
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});


app.use('/mngr', mngrRouter);
app.use('/admin', adminRouter);
app.use('/sperson', salesRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/images", express.static(__dirname + '/images'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log("404  Error")
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error');
});
app.listen(8080);