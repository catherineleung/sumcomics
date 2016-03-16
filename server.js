///<reference path='types/DefinitelyTyped/node/node.d.ts'/>
///<reference path='types/DefinitelyTyped/express/express.d.ts'/> 
// server.js
// for some reason we are using typescript so here we go
// remember to compile before running!!!!
var Application = (function () {
    function Application() {
        var express = require('express');
        var app = express();
        var port = process.env.PORT || 8080;
        var mongoose = require('mongoose');
        var passport = require('passport');
        var flash = require('connect-flash');
        var morgan = require('morgan');
        var cookieParser = require('cookie-parser');
        var bodyParser = require('body-parser');
        var methodOverride = require('method-override');
        var session = require('express-session');
        var configDB = require('./config/database.js');
        var url = configDB.url;
        var path = require('path');
        var http = require('http');
        var aws = require('aws-sdk');

        var AWS_ACCESS_KEY = 'AKIAIB7G6MWNC4MGB55A';
        var AWS_SECRET_KEY = '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';
        var S3_BUCKET = 'dimsumsquad';

        var fs = require('fs');
        var S3FS = require('s3fs');
        var s3fsImpls = new S3FS(S3_BUCKET, {
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_KEY
        });

        var multiparty = require('connect-multiparty');
        var multipartyMiddleware = multiparty();

        app.use(multipartyMiddleware);

        // Use the following when deploying to Heroku:

        // var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
        // var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
        // var S3_BUCKET = process.env.S3_BUCKET;

        // Set keys with
        // heroku config:set AWS_ACCESS_KEY=xxx AWS_SECRET_KEY=yyy

        // and
        // heroku config:set S3_BUCKET = zzz

        

        var contributions = [];
        // configuration ===============================================================
        mongoose.connect(url); // connect to our database
        require('./config/passport')(passport); // pass passport for configuration
        // set up our express application
        app.use(morgan('dev')); // log every request to the console
        app.use(cookieParser()); // read cookies (needed for auth)
        app.use(bodyParser.json()); // get information from html forms
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
        app.use(methodOverride());
        app.set('view engine', 'ejs'); // set up ejs for templating
        // required for passport
        app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
        app.use(passport.initialize());
        app.use(passport.session()); // persistent login sessions
        app.use(flash()); // use connect-flash for flash messages stored in session
        // routes ======================================================================
        require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
        app.use(express.static(path.join(__dirname, 'public')));
        // launch ======================================================================
        app.listen(port);
        console.log('The magic happens on port ' + port);
        // errors ======================================================================
        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
        // error handlers
        // development error handler
        // will print stacktrace
        if (app.get('env') === 'development') {
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err,
                    user: req.user
                });
            });
        }
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {},
                user: req.user
            });
        });
    }
    return Application;
})();
var application = new Application();
