//  OpenShift  Node application
var express     = require('express');
var fs          = require('fs');
var bodyParser  = require('body-parser');
var router      = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

var socket = require('socket.io');

//we get rest user api definition with routes
var user = require('./restAPI/userRoutes');

//we get rest beacon api definition with routes
var beacon = require('./restAPI/beaconRoutes');

//we get rest search fields api definition with routes
var searchfields = require('./restAPI/searchFieldsRoutes');

// we get rest add request api definition with routes 
var addrequest = require('./restAPI/addRequestRoutes');

// we get rest fileUpload api definiton with routes
var fileupload = require('./restAPI/fileUpload');
/**
 *  Rpro server
 */
var RproServer = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP ||
                         process.env.OPENSHIFT_INTERNAL_IP;
        self.port      = process.env.OPENSHIFT_INTERNAL_PORT ||process.env.OPENSHIFT_NODEJS_PORT || 8091;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_*_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express();
        
        // we push user routes to the router 
        // the url will be http://.../user/
        self.app.use('/user',user); 
        
         // we push beacon routes to the router 
        // the url will be http://.../beacon/
        self.app.use('/beacon',beacon);
        
         // we push searchfields routes to the router 
        // the url will be http://.../searchfields/
        self.app.use('/searchfields',searchfields);
        
         // we push searchfields routes to the router 
        // the url will be http://.../addRequest/
        self.app.use('/addrequest',addrequest);
        
        // we push searchfields routes to the router 
        // the url will be http://.../addRequest/
        self.app.use('/fileupload',fileupload);
        
         // catch 404 and forward to error handler
        self.app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });   
    };

   
    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
       // self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        
        //  Start the app on the specific interface (and port).
        var server = self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
               
    };

}; 

/**
 *  main():  Main code.
 */
var zapp = new RproServer();
zapp.initialize();
zapp.start();