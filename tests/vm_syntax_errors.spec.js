const vm = require( 'vm' );
const dissect = require( '../src' );

const ewal = code => {
  const ctx = { module, require, console, global, process };
  vm.createContext( ctx );
  vm.runInNewContext( code, ctx, { displayErrors: true } );
  ctx.module.exports();
};

describe( 'VM syntax errors dissection', () => {
  it( 'Should extract info from runtime throw inside the node vm', () => {

    const code = `
module.exports = ( => };
`;

    try {
      ewal( code );
    } catch ( err ) {
      const parsed = dissect( err );
      expect( parsed ).toEqual( {
        type: 'SyntaxError',
        message: 'Unexpected token =>',
        column: null,
        line: 2,
        file: null,
        expression: 'module.exports = ( => };',
        site: null,
        stack: expect.any( Array )
      } );
    }
  } );
} );
