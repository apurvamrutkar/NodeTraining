var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service : 'Gmail',
	auth: {
		user: 'vpamrutkar@gmail.com',
		pass: 'vpa31867'
	}
});


module.exports.sendMail = function(fromAddr, toAddr, subject, text){
	console.log("sending mail to", toAddr)
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: fromAddr, // sender address
	    to: toAddr, // list of receivers
	    subject: subject, // Subject line
	    text: text // plaintext body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        return;
	    }else{
	        console.log('Message sent: ' + info.response);
	        return;
	    }
	});
}