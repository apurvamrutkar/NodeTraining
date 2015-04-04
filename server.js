var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var hat = require('hat');
var underscore = require('underscore');
var email = require('./email');


var server = express();
server.use(function(req,res,next){
	console.log(req.method, req.url,req.body);
	next();
});


server.use(bodyParser.json());
server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
server.use(multer()); // for parsing multipart/form-data
server.use(expressValidator());//for validation
//server.use(underscore());//for id search and filters in for loop

server.get('/', function(request, res){
	res.send('Hello World. It is working');
});

var employeeList = [];

var EmployeesRoute = server.route('/employees/:employeeId')
	.get(function(req, res){
		var employeeId = req.params.employeeId;
		var e = underscore.where(employeeList, {id: employeeId});
		if(e!==undefined){
				res.send(JSON.stringify(e));
				return;
		}
		else{
			res.send("no employee found for the phone number entered");
		}
	})
	.put(function(req,res){
		var employeeId = req.params.employeeId;
		var e = underscore.where(employeeList, {id: employeeId});
		if(e!==undefined){
			var errors;
			req.assert('email','email empty').notEmpty();
			req.assert('name','name empty').notEmpty();
			req.assert('phone','phone empty').notEmpty();
			req.assert('email','valid email required').isEmail();
			req.assert('phone', 'not a valid 10 digit number').len(10,10).isInt();
			errors = req.validationErrors();
			if(errors){
				res.status(500);
				res.send({error : errors});
				return;
			}
			e.name  =req.body.name;
			e.phone = req.body.phone;
			e.email = req.body.email;
			res.send(JSON.stringify(employeeList));
			return;

		}
		else{
			res.send("no employee found for the phone number entered");
		}
	});
	
server.post('/employees',function(req, res){
		var errors;
		req.assert('email','email empty').notEmpty();
		req.assert('name','name empty').notEmpty();
		req.assert('phone','phone empty').notEmpty();
		req.assert('email','valid email required').isEmail();
		req.assert('phone', 'not a valid 10 digit number').len(10,10).isInt();
		errors = req.validationErrors();
		if(errors){
			res.status(500);
			res.send({error : errors});
			return;
		}
		var employee = {};
		employee.id=hat();
		employee.name  =req.body.name;
		employee.phone = req.body.phone;
		employee.email = req.body.email;

		employeeList.push(employee);
		console.log(employeeList.length);
		var emailText = "Hi "+employee.name+", Your employeeId is:"+employee.id;
		//email.sendMail('apurv.amrutkar@neebal.com',employee.email,'Welcome To Dream World', emailText);
		res.send(JSON.stringify(employeeList));
		return;


	});
server.listen(5555);