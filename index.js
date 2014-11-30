var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' )
  , js3 = require( 'mucbuc-jsthree' );

function CD_Agent( controller ) {

  var root = process.cwd()
    , cwd = root; 

  this.request = function( req, res ) {

    assert(   res.hasOwnProperty( 'argv' ) 
          &&  res.argv.length 
          &&  res.argv[0] == 'cd' );

    if (res.argv.length == 1) {
      setCwd( root );
      res.end();
    }
    else if (res.argv.length >= 2) {
      if (res.argv[1] == '~') {
        setCwd( root );
        res.end();
      }
      else if (res.argv[1] == '/') {
        setCwd( '/' );
        res.end();
      }
      else {
        var abs = path.join( cwd, res.argv[1] );
        fs.exists( abs, function( exist ) {
          if (exist) {
            setCwd(abs);
          }
          res.end();
        } );
      }
    }
  };

  function setCwd( dir ) {
    cwd = dir;
    controller.emit( 'cwd', dir );
    js3.DirScout.getList( controller, dir );
  }
};

module.exports = CD_Agent;

