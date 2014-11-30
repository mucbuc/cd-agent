var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' );

function CD_Agent( controller ) {

  var instance = this
    , cwd = root();

  this.__defineGetter__( 'cwd', function() {
    return cwd;
  });

  this.__defineSetter__( 'cwd', function(dir) {
    cwd = dir;
    controller.emit( 'cwd', cwd );
    fs.readdir( cwd, function( err, files ) {
      if (err) {
        console.log( err );
      }
      controller.emit( 'ls', files.sort() );
    });
  });

  this.request = function( req, res ) {
    
    assert(   res.hasOwnProperty( 'argv' ) 
          &&  res.argv.length 
          &&  res.argv[0] == 'cd'
          &&  typeof cwd !== 'undefined' );

    if (res.argv.length == 1) {
      respond(root());
    }
    else if (res.argv.length >= 2) {
      if (res.argv[1] == '~') {
        respond(root());
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
      
      controller.once( 'ls', function(list) {
        delete res.argv;
        res.cwd = instance.cwd;
        res.context = list;  
        res.end();
      });

      instance.cwd = cwd;
    }
  };

  function root() {
    return process.cwd();
  }
};

module.exports = CD_Agent;

