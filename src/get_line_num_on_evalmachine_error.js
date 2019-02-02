/**
 * search for a line number on a evalmachine error:
 * '    evalmachine.<anonymous>:4';
 */
module.exports = error => {
  const match = error.match( /\d+$/ );
  return match ? +match[0] : null;
};
