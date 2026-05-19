---
title: AuraCompiler
emoji:😎

colorFrom: green
colorTo: blue
sdk: docker
pinned: false
---

# AuraCompiler: Mini-C Compiler 

![AuraCompiler web frontend](https://drive.google.com/thumbnail?id=1LDZPgiVSnAhCFohKrwiHyTDQzzpk2js0&sz=w1200)
AuraCompiler is a browser-based compiler front end for a small C-like language called **Mini-C**. It was built for the **CSC301A Compilers** assignment at Ramaiah University of Applied Sciences.

The project demonstrates the main front-end phases of a compiler:

```text
Mini-C Source
  -> Lexer
  -> Parser
  -> Abstract Syntax Tree
  -> Semantic Analyzer
  -> Symbol Table
  -> Three-Address Code
  -> Interpreter Output
```

The app is dependency-free and runs with the Python standard library.

## Live Demo

The project is hosted on Hugging Face Spaces:

```text
https://puneeth-rv-auracompiler.hf.space
```

To run locally:

```bash
python3 web_server.py
```

Then open:

```text
http://127.0.0.1:8000
```

## Assignment Scope

| Compiler Part | Implemented |
|---------------|-------------|
| Lexical analysis | Yes |
| Syntax analysis | Yes |
| Abstract Syntax Tree | Yes |
| Semantic analysis | Yes |
| Symbol table | Yes |
| Intermediate code generation | Yes |
| Web-based demonstration | Yes |
| Program execution output | Extra feature |

## Supported Mini-C Features

| Feature | Example |
|---------|---------|
| Integer declarations | `int x;` |
| Float declarations | `float y = 10.5;` |
| One-dimensional integer arrays | `int values[4];` |
| Assignment | `x = 5 + 3;` |
| Arithmetic expressions | `+`, `-`, `*`, `/` |
| Relational expressions | `<`, `>`, `<=`, `>=`, `==`, `!=` |
| If-else statements | `if (x > 0) { ... } else { ... }` |
| While loops | `while (i < 10) { ... }` |
| Print statements | `print(x);` |
| Single-line comments | `// comment` |
| Block scopes | `{ int x; }` |

## Web Demo Features

The web interface is the main way to demonstrate the project.

- Source editor for Mini-C code
- Quick example selector with five valid programs and two error programs
- Tabs for `Output`, `All`, `Tokens`, `AST`, `Symbols`, and `TAC`
- Light and dark mode toggle
- Stage-specific execution, so the Tokens tab only runs the lexer and the AST tab only runs lexer plus parser
- Error reporting for lexical, syntax, semantic, and runtime errors

## Example Programs

The web app includes these quick-load examples:

| Group | Example | Purpose |
|-------|---------|---------|
| Valid | Pipeline Demo | Shows declarations, expressions, if-else, while, and print |
| Valid | Arithmetic Precedence | Shows expression precedence in AST and TAC |
| Valid | While Sum | Shows loop parsing and control-flow TAC |
| Valid | Array Access | Shows array declaration, indexing, and assignment |
| Valid | Float Branch | Shows int-to-float assignment and relational checks |
| Error | Type + Undeclared | Shows type mismatch and undeclared variable checks |
| Error | Missing Semicolon | Shows syntax error reporting |
| Error | Invalid Character | Shows lexical error reporting |
| Error | Float Array Index | Shows array index type checking |
| Error | Assign Array Name | Shows invalid direct assignment to an array |
| Error | Duplicate Declaration | Shows duplicate declaration detection |
| Error | Runtime Bounds | Shows runtime array bounds checking |

## Compiler Stages

### 1. Lexical Analysis

Implemented in `src/minic/lexer.py`.

The lexer scans the source code and produces tokens with:

- token type
- lexeme
- line number
- column number

Example token output:

```text
1:1   INT            int
1:5   IDENTIFIER     x
1:6   SEMICOLON      ;
```

### 2. Syntax Analysis and AST

Implemented in `src/minic/parser.py` and `src/minic/ast_nodes.py`.

The parser uses recursive descent parsing and builds an AST. The AST display shows the structure of the program and demonstrates operator precedence.

Example:

```text
Assign
├── target: Location [x]
└── value: BinOp [+]
    ├── left: Literal [5] (int)
    └── right: BinOp [*]
        ├── left: Literal [3] (int)
        └── right: Literal [2] (int)
```

### 3. Semantic Analysis and Symbol Table

Implemented in `src/minic/semantic.py`.

Checks include:

- variable used before declaration
- duplicate declaration in the same scope
- assigning `float` to `int`
- array index must be `int`
- arrays must be declared as `int[]`
- array size must be positive
- assigning directly to an array name is invalid

Example symbol table:

```text
Name  Type   Scope   Kind   Size
----  -----  ------  -----  ----
x     int    global  var    -
y     float  global  var    -
list  int[]  global  array  10
```

### 4. Three-Address Code

Implemented in `src/minic/tac.py`.

The TAC generator produces a simple intermediate representation using temporaries and labels.

Example:

```text
t1 = 3 * 2
t2 = 5 + t1
x = t2
```

### 5. Interpreter Output

Implemented in `src/minic/interpreter.py`.

The interpreter is an extra feature used by the web app's Output tab. It executes valid Mini-C programs and captures `print()` output.

## Error Handling

The project reports clear errors for invalid programs.

Lexical error example:

```text
Lexical error at line 2, column 8: unexpected character '@'
```

Semantic error example:

```text
Semantic error: cannot assign float value to int variable 'x'
Semantic error: variable 'z' used before declaration
```

## Project Structure

```text
.
├── web_server.py
├── Dockerfile
├── src/minic/
│   ├── tokens.py
│   ├── lexer.py
│   ├── ast_nodes.py
│   ├── parser.py
│   ├── semantic.py
│   ├── tac.py
│   ├── interpreter.py
│   └── pipeline.py
├── web/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── examples/
│   ├── valid_program.mc
│   ├── lexical_errors.mc
│   └── semantic_errors.mc
├── tests/
└── docs/
```

## Running Tests

```bash
python3 -m unittest discover -s tests
```

Expected result:

```text
Ran 28 tests
OK
```

## Deployment

Deploy to Hugging Face Spaces with:

```bash
./scripts/deploy_hf.sh
```

The deploy script creates a temporary clean branch for Hugging Face and only includes source files needed by the web app.

## Grammar

The grammar is documented in:

```text
docs/grammar.md
```

Main expression precedence:

| Precedence | Operators |
|------------|-----------|
| Highest | Parentheses |
| | Unary `-` |
| | `*`, `/` |
| | `+`, `-` |
| | `<`, `>`, `<=`, `>=` |
| Lowest | `==`, `!=` |

## License

This project is licensed under the MIT License.
