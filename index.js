var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' );

function CD_Agent() {

  var cwd = root();

  this.__defineGetter__( 'cwd', function() {
    return cwd;
  });

  this.eval = function( argv, done ) {
    
    if (    !argv.length 
        ||  argv[0] != 'cd') {
      done();
      return;
    }

    if (argv.length == 1) {
      respond(root());
    }
    else if (argv.length >= 2) {
      if (argv[1] == '~') {
        respond(root());
      }
      else if (argv[1] == '/') {
        respond( '/' );
      }
      else {
        var abs = path.join( cwd, argv[1] );
        fs.exists( abs, function( exist ) {
          if (exist) {
            respond(abs);
          }
          else {
            done();
          }
        } );
      }
    }

    function respond(dir) {
      cwd = dir;
      fs.readdir( cwd, function( err, files ) {
        if (err) throw( err );
        done(cwd, files);
      });
      
    }
  };

  function root() {
    return process.cwd();
  }
};

module.exports = CD_Agent;

