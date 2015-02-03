var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;

var Feature = new Schema({
    user_id    : String,
    content    : String,
    votes      : Number,
    updated_at : Date
});

mongoose.model( 'Feature', Feature );
mongoose.connect( process.env.MONGOLAB_URI );
