const { readFileSync } = require( 'fs' );
const limit = 150;
const isInt = Number.isInteger;

const isNativeModule = f => !/\/|\\/g.test( f ) && !/\.js$/.test( f );
const isValidFile = f => !!f && !isNativeModule( f );

module.exports = ( { file, line } ) => {
  if ( !isInt( line ) || !isValidFile( file ) ) { return null; }

  try {
    const content = readFileSync( file, 'utf8' );
    const codeLine = content.split( '\n' )[line - 1].trim();

    return codeLine.length > limit ? codeLine.substring( 0, 150 ) + '...' : codeLine;
  } catch ( err ) {
    return null;
  }
};
