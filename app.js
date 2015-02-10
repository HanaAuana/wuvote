/**
 * Module dependencies.
 */
require('newrelic');
// mongoose setup
require( './db' );

var express        = require( 'express' );
var http           = require( 'http' );
var path           = require( 'path' );
var favicon        = require( 'serve-favicon' );
var cookieParser   = require( 'cookie-parser' );
var bodyParser     = require( 'body-parser' );
var methodOverride = require( 'method-override' );
var logger         = require( 'morgan' );
var errorHandler   = require( 'errorhandler' );
var static         = require( 'serve-static' );

var app    = express();
var routes = require( './routes' );

// all environments
app.set("trust proxy", true);
app.set( 'port', process.env.PORT || 3001 );
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'jade' );
app.use( favicon( __dirname + '/public/favicon.ico' ));
app.use( logger( 'dev' ));
app.use( methodOverride());
app.use( cookieParser());
app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended : true }));

// Routes
//app.use( routes.current_user );
app.get(  '/',            routes.index );
app.get(  '/cat',         routes.cat );
app.post( '/create',      routes.create );
app.get(  '/destroy/:id', routes.destroy );
app.get(  '/edit/:id',    routes.edit );
app.post( '/update/:id',  routes.update );
app.get( '/upvote/:id',  routes.upvote );

app.use( static( path.join( __dirname, 'public' )));

// development only
if( 'development' == app.get( 'env' )){
  app.use( errorHandler());
}

http.createServer( app ).listen( app.get( 'port' ), function (){
  console.log( 'Express server listening on port ' + app.get( 'port' ));
});
