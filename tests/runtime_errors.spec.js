const dissect = require( '../src' );

describe( 'Runtime error dissection', () => {
  it( 'Should dissect explicit throwed runtime errors', () => {
    try {
      throw Error( 'Expected error' );
    } catch ( err ) {
      const detailed = dissect( err );
      expect( detailed ).toEqual( {
        line: 6,
        column: 13,
        expression: 'throw Error( \'Expected error\' );',
        message: 'Expected error',
        type: 'Error',
        site: 'Object.Error',
        file: '/app/tests/runtime_errors.spec.js',
        stack: expect.any( Array )
      } );
    }
  } );
} );
