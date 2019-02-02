const getExpression = require( './get_expression' );
const { readFileSync } = require( 'fs' );

jest.mock( 'fs', () => ( {
  readFileSync: jest.fn()
} ) );

describe( 'getExpression spec', () => {
  afterEach( () => {
    readFileSync.mockReset();
  } );

  describe( 'Unable to parse', () => {

    it( 'Should return null if there is no line info', () => {
      const error = { file: '/foo/bar.js', line: null };
      const result = getExpression( error );

      expect( result ).toBe( null );
      expect( readFileSync ).not.toHaveBeenCalled();
    } );

    it( 'Should return if file is not a js file', () => {
      const error = { file: '<anonymous>', line: 20 };
      const result = getExpression( error );

      expect( result ).toBe( null );
      expect( readFileSync ).not.toHaveBeenCalled();
    } );

    it( 'Should return if file is null', () => {
      const error = { file: null, line: 20 };
      const result = getExpression( error );

      expect( result ).toBe( null );
      expect( readFileSync ).not.toHaveBeenCalled();
    } );

    it( 'Should return null if there is an IO error', () => {
      const file = '/foo/bar.js';
      const error = { file, line: 20 };

      readFileSync.mockImplementation( () => { throw new Error(); } );

      const result = getExpression( error );

      expect( result ).toBe( null );
      expect( readFileSync ).toHaveBeenCalledWith( file, 'utf8' );
    } );
  } );

  describe( 'Able to parse', () => {
    it( 'Should read file content and return the line content', () => {
      const file = '/foo/bar.js';
      const error = { line: 2, file };

      readFileSync.mockReturnValue( `module.exports = () => {
const type = 'imported';
return type;
}` );

      const result = getExpression( error );

      expect( result ).toBe( 'const type = \'imported\';' );
      expect( readFileSync ).toHaveBeenCalledWith( file, 'utf8' );
    } );

    it( 'Should trim error lines', () => {
      const file = '/foo/bar.js';
      const error = { line: 2, file };

      readFileSync.mockReturnValue( `module.exports = () => {
        const type = 'imported';
        return type;
      }` );

      const result = getExpression( error );

      expect( result ).toBe( 'const type = \'imported\';' );
      expect( readFileSync ).toHaveBeenCalledWith( file, 'utf8' );
    } );


    it( 'Should read file content and return a substring of the line if it\'s too big (150+)', () => {
      const file = '/foo/bar.js';
      const error = { line: 2, file };

      readFileSync.mockReturnValue( `module.exports = () => {
const type = '${ Array( 200 ).fill( '0' ).join( '' ) }';
return type;
}` );

      const result = getExpression( error );

      expect( result ).toBe( 'const type = \'000000000000000000000000000000000000000000000000000\
0000000000000000000000000000000000000000000000000000000000000000000000000000000000000...' );
      expect( readFileSync ).toHaveBeenCalledWith( file, 'utf8' );
    } );
  } );
} );
