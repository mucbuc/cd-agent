var assert = require( 'assert' )
  , fs = require( 'fs' )
  , path = require( 'path' )
  , events = require( 'events' )
  , js3 = require( 'mucbuc-jsthree' );

function CD_Agent() {

  var instance = this
    , controller = new events.EventEmitter() // this shoud be cleaned up
    , cwd;

  this.__defineGetter__( 'cwd', function() {
    return cwd;
  });

  this.__defineSetter__( 'cwd', function(dir) {
    cwd = dir;
    js3.DirScout.getList( controller, cwd );
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
        res.context = list;  
        res.end();
      });

      res.cwd = instance.cwd = cwd;
    }
  };

  this.cwd = root();

  function root() {
    return process.cwd();
  }
};

module.exports = CD_Agent;

