var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Feature = new Schema({
    //user_id    : String,
    ip         : String,
    content    : String,
    category   : String,
    votes      : Number,
    updated_at : Date
});

var Vote = new Schema({
    ip         : String,
    features   : Array,
    updated_at : Date
});

mongoose.model( 'Feature', Feature );
mongoose.model( 'Vote', Vote );
mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost:27017/wuvote" );
