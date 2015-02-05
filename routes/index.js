var utils    = require( '../utils' );
var mongoose = require( 'mongoose' );
var Feature  = mongoose.model( 'Feature' );
var Vote  = mongoose.model( 'Vote' );

exports.index = function ( req, res, next ){
  

  Feature.
    find().
    sort( '-votes' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'index', {
          title : 'Feature Requests',
          features : features
      });
    });
};

exports.forms = function ( req, res, next ){
  
  Feature.
    find().
    sort( '-votes' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'cat1', {
          title : 'Forms',
          features : features
      });
    });
};

exports.reports = function ( req, res, next ){

  Feature.
    find().
    sort( '-votes' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'cat2', {
          title : 'Reports',
          features : features
      });
    });
};

exports.general = function ( req, res, next ){
  

  Feature.
    find().
    sort( '-votes' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'cat3', {
          title : 'General',
          features : features
      });
    });
};

exports.create = function ( req, res, next ){
  var clientIP = req.headers["x-forwarded-for"];
  if (clientIP){
    var list = clientIP.split(",");
    clientIP = list[list.length-1];
  } else {
    clientIP = req.ip;
  }
  new Feature({
      //user_id    : req.cookies.user_id,
      ip         : clientIP,
      content    : req.body.content,
      category   : req.body.category || "General",
      votes      : 0,
      updated_at : Date.now()
  }).save( function ( err, feature, count ){
    if( err ) return next( err );

    res.redirect( '/' );
  });
};

exports.destroy = function ( req, res, next ){
  var clientIP = req.headers["x-forwarded-for"];
  if (clientIP){
    var list = clientIP.split(",");
    clientIP = list[list.length-1];
  } else {
    clientIP = req.ip;
  }
  Feature.findById( req.params.id, function ( err, feature ){
    

    if( feature.ip !== clientIP ){
      return utils.forbidden( res );
    }

    feature.remove( function ( err, feature ){
      if( err ) return next( err );

      res.redirect( req.header('Referer') );
    });
  });
};

exports.edit = function( req, res, next ){
  var clientIP = req.headers["x-forwarded-for"];
  if (clientIP){
    var list = clientIP.split(",");
    clientIP = list[list.length-1];
  } else {
    clientIP = req.ip;
  }
  Feature.
    find({ ip : clientIP }).
    sort( '-updated_at' ).
    exec( function ( err, features ){
      if( err ) return next( err );

      res.render( 'edit', {
        title   : 'Edit your requests',
        features   : features,
        current : req.params.id
      });
    });
};

exports.update = function( req, res, next ){
  var clientIP = req.headers["x-forwarded-for"];
  if (clientIP){
    var list = clientIP.split(",");
    clientIP = list[list.length-1];
  } else {
    clientIP = req.ip;
  }
  Feature.findById( req.params.id, function ( err, feature ){

    if( feature.ip !== clientIP ){
      return utils.forbidden( res );
    }

    feature.content    = req.body.content;
    feature.updated_at = Date.now();
    feature.save( function ( err, feature, count ){
      if( err ) return next( err );

      res.redirect('/edit/'+req.params.id);
    });
  });
};

exports.upvote = function( req, res, next ){
  var userVotes;
  var voterId;
  var clientIP = req.headers["x-forwarded-for"];
  if (clientIP){
    var list = clientIP.split(",");
    clientIP = list[list.length-1];
  } else {
    clientIP = req.ip;
  }
  Vote.find({ ip: clientIP }, function (err, vote){
    userVotes = vote;
    if( err ) {
      return next( err );
    }
    if (typeof vote == 'undefined' || vote.length <= 0) {
      Feature.findById( req.params.id, function ( err, feature ){
        feature.votes      = feature.votes+1;
        feature.updated_at = Date.now();
        feature.save( function ( err, feature, count ){
          if( err ){
            return next( err );
          } 
          var newVotes;
          var thisFeature = ""+ req.params.id;
          newVotes = [thisFeature];
          new Vote({
              ip         : clientIP,
              features   : newVotes,
              updated_at : Date.now()
          }).save( function ( err, vote, count ){
            if( err ) return next( err );
          });
          res.redirect( req.header('Referer') );
        });
      });
    }
    else{
      voterId = vote[0]._id;
      featuresVotedFor = userVotes[0].features;
      var hasVoted = false;
      for(feature in featuresVotedFor){
        if(featuresVotedFor[feature] == req.params.id){
          hasVoted = true;
        }
      }
      
      if(hasVoted){
        res.redirect( req.header('Referer') );
      }
      else{
        Feature.findById( req.params.id, function ( err, feature ){
          feature.votes      = feature.votes+1;
          feature.updated_at = Date.now();
          feature.save( function ( err, feature, count ){
            if( err ) return next( err );

            var addedThisVote;
            userVotes[0].features.push(req.params.id);
            addedThisVote = userVotes[0].features;
            Vote.findById( voterId, function ( err, vote ){
              vote.features    = addedThisVote;
              vote.updated_at  = Date.now();
              vote.save( function ( err, vote, count ){
                if( err ) return next( err );
                res.redirect( req.header('Referer') );
              });
            });
          });
        });
      }
    }

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
