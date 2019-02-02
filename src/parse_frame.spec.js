const parseFrame = require( './parse_frame' );

describe( 'parseFrame spec', () => {
  it( 'Should extract both column and line number', () => {
    const frame = '    at Object.runInNewContext (vm.js:93:10)';
    const location = parseFrame( frame );
    expect( location.site ).toBe( 'Object.runInNewContext' );
    expect( location.file ).toBe( 'vm.js' );
    expect( location.line ).toBe( 93 );
    expect( location.column ).toBe( 10 );
  } );

  it( 'Should extract just line num when there are no col info', () => {
    const frame = '    at Object.runInNewContext (vm.js::10)';
    const location = parseFrame( frame );
    expect( location.site ).toBe( 'Object.runInNewContext' );
    expect( location.file ).toBe( 'vm.js' );
    expect( location.line ).toBe( null );
    expect( location.column ).toBe( 10 );
  } );

  it( 'Should extract nothing when this info is absent', () => {
    const frame = '    at Object.runInNewContext (vm.js)';
    const location = parseFrame( frame );
    expect( location.site ).toBe( 'Object.runInNewContext' );
    expect( location.file ).toBe( 'vm.js' );
    expect( location.line ).toBe( null );
    expect( location.column ).toBe( null );
  } );
} );
