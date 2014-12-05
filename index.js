var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' );

function eval( params, done ) {

  var argv = params.argv
    , cwd = params.cwd;

  assert( typeof done !== 'undefined' ); 

  if (    !Array.isArray( argv )
      ||  !argv.length 
      ||  argv[0] != 'cd') {
    done();
    return;
  }

  if (typeof cwd === 'undefined') {
    cwd = process.cwd();
  }

  if (argv.length == 1) {
    respond(cwd);
  }
  else if (argv.length >= 2) {
    if (argv[1] == '~') {
      respond(cwd);
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
    fs.readdir( dir, function( err, files ) {
      if (err) throw( err );
      done(dir, files);
    });
  }
}

module.exports = eval;

