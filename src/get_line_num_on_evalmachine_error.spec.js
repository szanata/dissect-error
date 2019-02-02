const getLineNum = require( './get_line_num_on_evalmachine_error' );

describe( 'getLineNumOnEvalmachineError test', () => {
  it( 'Should extract the line number', () => {
    const errorFrame = '    evalmachine.<anonymous>:4';
    const lineNum = getLineNum( errorFrame );
    expect( lineNum ).toBe( 4 );
  } );

  it( 'Should return null when there are no info', () => {
    const errorFrame = '    evalmachine.<anonymous>';
    const lineNum = getLineNum( errorFrame );
    expect( lineNum ).toBe( null );
  } );
} );
