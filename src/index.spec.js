const dissect = require( './' );

describe.only( 'Eval Error Parser', () => {
  it( 'Should not break if there is no stack trace', () => {
    const err = {
      name: 'ReferenceError',
      message: 'Invalid left-hand side in assignment',
      stack: ''
    };

    const parsed = dissect( err );
    expect( parsed.type ).toBe( 'ReferenceError' );
    expect( parsed.column ).toBe( null );
    expect( parsed.line ).toBe( null );
    expect( parsed.expression ).toBe( null );
    expect( parsed.message ).toBe( 'Invalid left-hand side in assignment' );
  } );

  describe( 'Syntax Errors', () => {
    it( 'Should parse a ReferenceError within a stack trace without expression cause', () => {
      const err = {
        name: 'ReferenceError',
        message: 'Invalid left-hand side in assignment',
        stack: 'evalmachine.<anonymous>:4'
      };

      const parsed = dissect( err );
      expect( parsed.type ).toBe( 'ReferenceError' );
      expect( parsed.column ).toBe( null );
      expect( parsed.line ).toBe( 4 );
      expect( parsed.expression ).toBe( null );
      expect( parsed.message ).toBe( 'Invalid left-hand side in assignment' );
    } );

    it( 'Should parse a ReferenceError', () => {
      const err = {
        name: 'ReferenceError',
        message: 'Invalid left-hand side in assignment',
        stack: `evalmachine.<anonymous>:4
          1 = 2;
          ^
ReferenceError: Invalid left-hand side in assignment
    at createScript (vm.js:56:10)
    at Object.runInNewContext (vm.js:93:10)
    at Object.run (/app/code_base/project/lib/code_validator.js:37:10)
    at Context.e (/app/code_base/project/lib/code_validator.spec.js:32:21)`
      };

      const parsed = dissect( err );
      expect( parsed.type ).toBe( 'ReferenceError' );
      expect( parsed.column ).toBe( null );
      expect( parsed.line ).toBe( 4 );
      expect( parsed.expression ).toBe( '1 = 2;' );
      expect( parsed.message ).toBe( 'Invalid left-hand side in assignment' );
    } );

    it( 'Should parse a SyntaxErrorr', () => {
      const err = {
        name: 'SyntaxError',
        message: 'Unexpected identifier',
        stack: `evalmachine.<anonymous>:3
        async realtime( MW, event ) {
              ^^^^^^^^
SyntaxError: Unexpected identifier
    at createScript (vm.js:56:10)
    at Object.runInNewContext (vm.js:93:10)
    at Object.run (/app/code_base/project/lib/code_validator.js:37:10)
    at Context.e (/app/code_base/project/lib/code_validator.spec.js:60:21)`
      };

      const parsed = dissect( err );
      expect( parsed.type ).toBe( 'SyntaxError' );
      expect( parsed.column ).toBe( null );
      expect( parsed.line ).toBe( 3 );
      expect( parsed.expression ).toBe( 'async realtime( MW, event ) {' );
      expect( parsed.message ).toBe( 'Unexpected identifier' );
    } );
  } );

  describe( 'Runtime Erros', () => {

    describe( 'Using an eval machine', () => {

      it( 'Should dissect a TypeError throwed inside', () => {
        const err = {
          name: 'TypeError',
          message: 'Cannot create property \'true\' on boolean \'false\'',
          stack: `TypeError: Cannot create property 'true' on boolean 'false'
      at Object.realtime (evalmachine.<anonymous>:4:22)
      at Object.run (/app/code_base/project/lib/code_validator.js:39:26)
      at Context.e (/app/code_base/project/lib/code_validator.spec.js:77:21)
      at callFn (/app/code_base/project/node_modules/mocha/lib/runnable.js:360:21)
      at Test.Runnable.run (/app/code_base/project/node_modules/mocha/lib/runnable.js:352:7)`
        };

        const parsed = dissect( err );
        expect( parsed.type ).toBe( 'TypeError' );
        expect( parsed.column ).toBe( 26 );
        expect( parsed.line ).toBe( 39 );
        expect( parsed.expression ).toBe( null );
        expect( parsed.message ).toBe( 'Cannot create property \'true\' on boolean \'false\'' );
      } );
    } );

    describe( 'Running the code directly', () => {
      it( 'Should dissect a TypeError', () => {
        const err = {
          name: 'TypeError',
          message: 'Cannot create property \'true\' on boolean \'false\'',
          stack: `TypeError: Cannot create property 'true' on boolean 'false'
      at Object.run (/app/code_base/project/lib/code_validator.js:39:26)
      at Context.e (/app/code_base/project/lib/code_validator.spec.js:77:21)
      at callFn (/app/code_base/project/node_modules/mocha/lib/runnable.js:360:21)
      at Test.Runnable.run (/app/code_base/project/node_modules/mocha/lib/runnable.js:352:7)`
        };

        const parsed = dissect( err );
        expect( parsed.type ).toBe( 'TypeError' );
        expect( parsed.column ).toBe( 26 );
        expect( parsed.line ).toBe( 39 );
        expect( parsed.expression ).toBe( null );
        expect( parsed.message ).toBe( 'Cannot create property \'true\' on boolean \'false\'' );
      } );
    } );
  } );
} );
