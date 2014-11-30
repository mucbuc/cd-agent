var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' )
  , js3 = require( 'mucbuc-jsthree' );

function CD_Agent( controller ) {

  var root = process.cwd()
    , cwd = root
    , instance = this;

  this.__defineGetter__( 'cwd', function() {
    return cwd;
  });

  this.__defineSetter__( 'cwd', function(dir) {
    cwd = dir;
    controller.emit( 'cwd', cwd );
    js3.DirScout.getList( controller, cwd ); 
  });

  this.request = function( req, res ) {

    assert(   res.hasOwnProperty( 'argv' ) 
          &&  res.argv.length 
          &&  res.argv[0] == 'cd' );

    if (res.argv.length == 1) {
      respond(root);
    }
    else if (res.argv.length >= 2) {
      if (res.argv[1] == '~') {
        respond(root);
      }
      else if (res.argv[1] == '/') {
        respond( '/' );
      }
      else {
        var abs = path.join( cwd, res.argv[1] );
        fs.exists( abs, function( exist ) {
          if (exist) {
            respond(abs);
          }
          else {
            res.end();
          }
        } );
      }
    }

    function respond(cwd) {
      instance.cwd = cwd;
      delete res.argv;
      res.end();
    }
  };
};

module.exports = CD_Agent;

