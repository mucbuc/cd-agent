#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , path = require( 'path')
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
    agent = new CD_Agent( e );
  });

  test( 'cwd init', function() {
    assert( agent.cwd === process.cwd() ); 
  });

  test( 'cd', function() {
    expectCWD();
    makeSplitRequest( ['cd'] );
  });

  test( 'cd ~', function() {
    expectCWD();
    makeSplitRequest( ['cd', '~'] );
  });

  test( 'cd /', function() {
   e.expect( 'cwd', '/' );
   makeSplitRequest( ['cd', '/'] );
  }); 

  test( 'cd folder', function() {
    e.expect( 'cwd', path.join( __dirname, 'sample' ) );
    e.expect( 'ls', [] );
    makeSplitRequest( ['cd', 'sample' ] );
  });

  function makeSplitRequest( argv ) {
    agent.request( 
      {}, 
      {
        argv: argv,
        end: function() {
          process.on( 'exit', e.check );
        }
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

