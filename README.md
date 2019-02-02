# Dissect Error

Parse some js error and extract a sort of usefull info like:
- Error type
- message
- error site
- line
- column
- expression which threw the error
- file name (with path)
- stack trace

Works with **runtime errors**, **syntax errors**, **node VM eval errors** and plain **eval errors**

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
| .site | What threw the error, like the function name or class name |
| .line | Line # where the error happen |
| .column | Column # where the error happen |
| .stack | Array of frames from the stack trace, each frame is an object with `site`, `file`, `line` and `column` |
| .expression | Expression which threw the error. Eg: `const 2 = 1;` |
| .file | The file which thre the error. Eg: `/app/project/index.js` |

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
