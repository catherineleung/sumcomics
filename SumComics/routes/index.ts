///<reference path='../types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='../types/DefinitelyTyped/express/express.d.ts'/>

interface UserInterface {
    getName(): string;
    getEmail(): string;
    getPassword(): string;
}

class User implements UserInterface {
    private username: string;
    private email: string;
    private password: string;
    private confirmpassword: string;

    constructor(username: string, email: string, password: string, confirmpassword: string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmpassword = confirmpassword;
    }

    getName() {
         return this.username ;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    getConfirmPassword() {
        return this.confirmpassword;
    }
}


class Router {
    constructor() {
        var express = require('express');
        var router = express.Router();
        
        // added this in for file uploading
        
        var multer  =   require('multer');
        var storage =   multer.diskStorage({
            destination: function (req, file, callback) {
            callback(null, './uploads');
                },
            filename: function (req, file, callback) {
            // callback(null, file.fieldname + '_' + Date.now());
            callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
            
            // name of the image file
            var imageFileName =  file.fieldname + '_' + Date.now() + '_' + file.originalname;
            
            }

            });
        var upload = multer({ storage : storage}).single('userPhoto');
        
        // end of file uploading stuff
       
        /* GET home page. */
        router.get('/', function(req, res, next) {
          res.render('index', { title: 'Express' });
        });
        
        /* GET upload page. */
        router.get('/upload',function(req,res){
            res.sendFile(__dirname + "/upload.html");
        });

        /* POST/UPLOAD picture */
        router.post('/api/photo',function(req,res){
            upload(req,res,function(err) {
            if(err) {
                return res.end("Error uploading file.");
            }
            res.sendStatus(200);
            // res.redirect('/upload');
            // res.end("File is uploaded");

            });
            });

        /* GET Userlist page. */
        router.get('/userlist', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({},{},function(e,docs){
                res.render('userlist', {
                    "userlist" : docs
                });
            });
        });

        /* GET New User page. */
        router.get('/newuser', function(req, res) {
            res.render('newuser', { 
            	title1: 'Registration',
            });
        });

        /* POST to Add User Service */
        router.post('/adduser', function(req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            
            var user = new User(req.body.username, req.body.useremail, req.body.userpassword, req.body.userconfirmpassword);

            var userName = user.getName();
            var userEmail = user.getEmail();
            var userPassword = user.getPassword();
            var userConfirmPassword = user.getConfirmPassword()

            // Set our collection
            var collection = db.get('usercollection');

            // Submit to the DB
            collection.insert({
            	"username" : userName,
            	"email" : userEmail,
                "password" : userPassword,
                "confirmpassword": userConfirmPassword
            }, function(err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // And forward to success page
                    res.redirect("userlist");
                }
            });

            
        });

        // Remove all users
        router.post('/removeallusers', function(req, res) {
        	var db = req.db;

        	var collection = db.get('usercollection');

        	collection.remove({});
        	res.redirect("userlist");
        })

        // Remove user
        router.post('/removeuser', function(req, res) {
        	var db = req.db;

        	var userName = req.body.username;

        	var collection = db.get('usercollection');

        	collection.remove( { "username" : { $eq: userName } }, 
        		function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem removing the information to the database.");
                }
                else {
                    // And forward to success page
                    res.redirect("userlist");
                }
            });
        })

        module.exports = router;
    }
}

var router = new Router();