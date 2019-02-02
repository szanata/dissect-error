const ParsedError = require( './parsed_error' );
const parseFrame = require( './parse_frame' );
const getLineNumOnEvalmachineError = require( './get_line_num_on_evalmachine_error' );
const getExpression = require( './get_expression' );

const trimmedStringOrNull = v => ( typeof v === 'string' ? v.trim() : null );

/**
 * @typedef {Object} ParsedError
 * @property {string} type Error type. eg: ReferenceError
 * @property {string} message The cause of the error. eg: "Invalid left-hand side in assignment"
 * @property {string} expression The computed expression that caused the error. eg: '1 == 2'
 * @property {number} line The line where the error was thrown. eg: 26
 * @property {number} column The column where the error was thrown. eg: 12
 * @property {string} file The file where the error occured. Eg. /root/etc/code.js
 */

/**
 * Receives a js Error and the code that throwed it (as string) and retieves informations about this error
 *
 * @param {Error} rawErr The error thrown by the code
 * @return {ParsedError}
 */
module.exports = rawErr => {
  if ( !rawErr.stack && !rawErr.name ) {
    throw new TypeError( 'Error argument must be a instance of Error or must be parseable as an error.' );
  }

  const error = new ParsedError( rawErr.name, { message: rawErr.message } );
  const [ description, ...stack ] = rawErr.stack.split( '\n' );

  // parse + clean the stack
  error.stack = stack.filter( f => f.includes( ' at ' ) ).map( parseFrame );

  // VM syntax errors are different
  if ( description.startsWith( 'evalmachine' ) ) {
    error.line = getLineNumOnEvalmachineError( description );
    error.expression = trimmedStringOrNull( stack[0] );
    return error.toJSON();
  }

  // Runtime errors

  // unwrap eval errors;
  const frame = error.stack.find( f => !f.file.startsWith( 'evalmachine.' ) );
  if ( frame ) {
    error.site = frame.site;
    error.file = frame.file;
    error.line = frame.line;
    error.column = frame.column;
    error.expression = getExpression( error );
  }

  return error.toJSON();
};
