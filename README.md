# Dissect Error

[![Build Status](https://travis-ci.org/szanata/dissect-error.svg?branch=master)](https://travis-ci.org/szanata/dissect-error)

Parse some js error and extract all sorts of useful info:
- type (`SyntaxError`, `ReferenceError`, etc)
- message
- error site
- line
- column
- code that threw the error
- file
- stack trace (parsed as array)

Works with **runtime errors**, **syntax errors**, **node VM eval errors** and plain **eval errors**

And have **zero** dependencies!

## How to use?

### 1. Install it

```bash
npm install -S dissect-error
```

### 2. Import it

```js
const dissect = require( 'dissect-error' );
```

### 3. Use it

```js
try {
  // throw some error
} catch ( err ) {
  const info = dissect( err );

  console.log( info );
}
```

## Properties

The dissect function return an object with the following properties:

| property | description |
| -------- | ----------- |
| .type | JS error types like: Error, SyntaxError, MyCustomError, etc |
| .message | The message from the error |
| .site | What threw the error, Eg. `Object.eval`|
| .line | Line # where the error happen |
| .column | Column # where the error happen |
| .stack | Array of frames from the stack trace, each frame is an object (see below) |
| .expression | Expression which threw the error. Eg: `const 2 = 1;` |
| .file | The file which threw the error. Eg: `/app/project/index.js` |

The `.stack` returns an array of stack frames wich have the folowing properties

| property | description |
| -------- | ----------- |
| .site | What thre the error. Eg. `Object.eval` |
| .file | The file which threw the error |
| .line | Line # where the error happen |
| .column | Column # where the error happen |

## Output sample

```js
{
  type: 'ReferenceError',
  site: 'call',
  stack: [ 
    { 
      site: 'module.exports.realtime',
      file: 'evalmachine.<anonymous>',
      line: 3,
      column: 21
    },
    {
      site: 'call',
      file: '/app/project/lib/index.js',
      line: 34,
      column: 51
    },
    {
      site: 'run',
      file: '/app/project/lib/index.js',
      line: 40,
      column: 32
    }
  ],
  column: 51,
  line: 34,
  expression: 'const result = await fn.call( null, ...args );',
  message: 'fn is not defined',
  file: '/app/project/lib/index.js'
}
```       

## Use cases

### Plain runtime errors

```js
try {
  await IO();
} catch ( err ) {
  const parsed = dissect( err );

  // result
  parsed.line; // 2
  parsed.expression; // await IO();
  parsed.site; // IO;
}
```

### Node VM errors

Node VM errors are a bit different as they are parsed relative to the code evaluated by the VM, instead of the context of the VM invokation.

```js
const vm = require( 'vm' );
const dissect = require( 'dissect-error' );

const code = `
module.exports = ( => };
`;

const ctx = { module, require, console, global, process };
vm.createContext( ctx );

try {
  vm.runInNewContext( code, ctx, { displayErrors: true } );
} catch ( err ) {
  const parsed = dissect( err );
  
  // result 
  parsed.type; // SyntaxError
  parsed.message; // Unexpected token =>
  parsed.line; // 2 (relative to the "code" parsed by the node VM)
  parsed.expression; // 'module.exports = ( => };
}
```
