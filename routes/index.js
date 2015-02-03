var utils    = require( '../utils' );
var mongoose = require( 'mongoose' );
var Feature  = mongoose.model( 'Feature' );

exports.index = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Feature.
    find({ user_id : user_id }).
    sort( '-votes' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'index', {
          title : 'Feature Requests',
          features : features
      });
    });
};

exports.create = function ( req, res, next ){
  new Feature({
      user_id    : req.cookies.user_id,
      content    : req.body.content,
      votes      : 1,
      updated_at : Date.now()
  }).save( function ( err, feature, count ){
    if( err ) return next( err );

    res.redirect( '/' );
  });
};

exports.destroy = function ( req, res, next ){
  Feature.findById( req.params.id, function ( err, feature ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( feature.user_id !== user_id ){
      return utils.forbidden( res );
    }

    feature.remove( function ( err, feature ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

exports.edit = function( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  Feature.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'edit', {
        title   : 'Feature Requests',
        features   : features,
        current : req.params.id
      });
    });
};

exports.update = function( req, res, next ){
  Feature.findById( req.params.id, function ( err, feature ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( feature.user_id !== user_id ){
      return utils.forbidden( res );
    }

    feature.content    = req.body.content;
    feature.updated_at = Date.now();
    feature.save( function ( err, feature, count ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

exports.upvote = function( req, res, next ){
  Feature.findById( req.params.id, function ( err, feature ){

    feature.content    = feature.content;
    feature.votes      = feature.votes+1;
    feature.updated_at = Date.now();
    feature.save( function ( err, feature, count ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }

  next();
};
