const dissect = require( '../src' );

describe( 'Syntax error dissection', () => {
  it( 'Should dissect syntax errors', () => {
    try {
      eval( 'const b = ( => };' );
    } catch ( err ) {
      const detailed = dissect( err );
      expect( detailed ).toEqual( {
        line: 6,
        column: 7,
        message: 'Unexpected token =>',
        expression: 'eval( \'const b = ( => };\' );',
        site: 'Object.eval',
        type: 'SyntaxError',
        file: expect.stringContaining( 'syntax_errors.spec.js' ),
        stack: expect.any( Array )
      } );
    }
  } );
} );
