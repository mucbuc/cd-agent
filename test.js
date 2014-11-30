#!/usr/bin/env node

var assert = require( 'assert' )
  , events = require( 'events' )
  , path = require( 'path')
  , CD_Agent = require( './index.js' );

assert( typeof CD_Agent !== 'undefined' );

suite( 'cd-agent', testCD ); 

function testCD() {
	var e
	  , agent
	  , passedCount = 0
	  , expectedCount = 0; 

	setup(function(){
		e = new events.EventEmitter();
		agent = new CD_Agent( e );
	});

	teardown(function(){
		assert( passedCount == expectedCount );
	});

	test( 'cd', function() {
		expectCWD();
		agent.request( {}, makeResponse( ['cd'] ) );
	});

	test( 'cd ~', function() {
		expectCWD();
		 ;
		agent.request( {}, makeResponse( ['cd', '~'] ) );
	});

	test( 'cd /', function() {
		expectPath( '/' );
		agent.request( {}, makeResponse( ['cd', '/'] ) );
	}); 

	test( 'cd folder', function() {
		expectPath( path.join( __dirname, 'sample' ) );
		agent.request( {}, makeResponse( ['cd', 'sample' ] ) );
	});

	function makeResponse( argv ) {
		return {
			argv: argv,
			end: function() {}
		};
	}

	function expectPath(expected) {	
		e.once( 'cwd', function(path) { 
			assert( path == expected );
			++passedCount;
		});
		++expectedCount;
	}
	
	function expectCWD() {	
		expectPath( __dirname );
		// e.once( 'ls', function(list) {
		// 	assert( list.indexOf( 'test.js' ) != -1 );
		// });
	}
}

