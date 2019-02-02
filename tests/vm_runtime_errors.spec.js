const vm = require( 'vm' );
const dissect = require( '../src' );

const ewal = code => {
  const ctx = { module, require, console, global, process };
  vm.createContext( ctx );
  vm.runInNewContext( code, ctx, { displayErrors: true } );
  ctx.module.exports();
};

describe( 'VM runtime errors dissection', () => {
  it( 'Should extract info from runtime throw inside the node vm', () => {

    const code = `
module.exports = () => {
  throw new Error( 'Expected error' );
}`;

    try {
      ewal( code );
    } catch ( err ) {
      const parsed = dissect( err );
      expect( parsed ).toEqual( {
        type: 'Error',
        message: 'Expected error',
        column: 14,
        line: 8,
        file: expect.stringContaining( 'vm_runtime_errors.spec.js' ),
        expression: 'ctx.module.exports();',
        site: 'exports',
        stack: expect.any( Array )
      } );
    }
  } );
} );
