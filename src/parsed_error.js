module.exports = class ParsedError {
  constructor( type, { message = null, site = null, stack = [], column = null, line = null, expression = null, file = null } ) {
    this.type = type;
    this.site = site;
    this.stack = stack;
    this.column = column;
    this.line = line;
    this.expression = expression;
    this.message = message;
    this.file = file;
  }

  toJSON() {
    return {
      type: this.type,
      site: this.site,
      stack: this.stack,
      column: this.column,
      line: this.line,
      expression: this.expression,
      message: this.message,
      file: this.file
    };
  }
};
