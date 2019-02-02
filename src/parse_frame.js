/**
 * Get an error stack frame and parse the site, file, line and column
 * The frame is something like this:
 * '    at Object.runInNewContext (vm.js:93:10)'
 */
module.exports = ( frame = '' ) => {
  const [ , site, location = '' ] = Array.from( frame.match( /^\s*at\s+(.+)\s+\((.*)\)$/ ) || [] );
  const [ file, line, column ] = location.split( ':' );
  return { site, file, line: +line || null, column: +column || null };
};
