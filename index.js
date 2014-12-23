var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path-extra' );

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
    respond(cwd, done);
  }
  else if (argv.length >= 2) {
    if (argv[1] == '/') {
      respond( '/', done);
    }
    else {
      var abs;
      if (!argv[1].indexOf( '~/' )) {
        abs = argv[1].replace( '~/', path.join( path.homedir(), '/' ) );
      }
      else if (argv[1] == '~' ) {
        abs = path.homedir();
      }
      else {
        abs = path.join( cwd, argv[1] );  
      }
      
      fs.exists( abs, function( exist ) {
        if (exist) {
          respond(abs, done);
        }
        else {
          done();
        }
      } );
    }
  }

  function respond(dir, done) {
    fs.readdir( dir, function( err, files ) {
      if (err) throw( err );
      done(dir, files);
    });
  }
}

module.exports = eval;

