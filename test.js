#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , path = require( 'path-extra')
  , CD_Agent = require( './index.js' )
  , Expector = require( 'expector' ).Expector
  , util = require( 'util' );

assert( typeof CD_Agent !== 'undefined' );
assert( typeof Expector !== 'undefined' );

suite( 'cd-agent', testCD ); 

function testCD() {
  var e
    , agent
    , passedCount = 0
    , expectedCount = 0; 

  setup(function(){
    e = new Expector();
  });

  teardown(function(){
    process.on( 'exit', function() {
      e.check();
    } );
  });

  test( 'cd', function() {
    expectCWD();
    eval( ['cd'] );
  });

  test( 'cd ~', function() {
    e.expect( 'cwd', path.homedir() );
    eval( ['cd', '~' ] );
  });

  test( 'cd /', function() {
   e.expect( 'cwd', '/' );
   eval( ['cd', '/'] );
  }); 

/*  test( 'cd ~/sample', function() {
    e.expect( 'cwd', path.join( path.homedir(), 'work/cd-agent/sample' ) );
    e.expect( 'ls', [] );
    eval( ['cd', '~/work/cd-agent/sample' ] );
  });*/

  test( 'cd sample', function() {
    e.expect( 'cwd', path.join( __dirname, 'sample' ) );
    e.expect( 'ls', [] );
    eval( ['cd', 'sample' ] );
  });

  function eval( argv ) {
    CD_Agent( 
      { argv: argv },
      function(cwd, files) {
        e.emit( 'cwd', cwd );
        e.emit( 'ls', files ); 
      });
  }
  
  function expectCWD() {  
    e.expect( 'cwd', process.cwd() );
    e.expect( 'ls', [ 
      '.git',
      '.gitignore',
      'LICENSE',
      'README.md',
      'index.js',
      'node_modules',
      'package.json',
      'sample',
      'test.js' ] );
  }
}

