const INTEGER = "INTEGER";
const SUBTRACTION = "SUBTRACTION";
const EOF = "EOF";

function isDigit(str) {
  return !isNaN(Number(str));
}

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  toString() {
    return `Token${this.type},${this.value}`;
  }

  repr() {
    return this.str();
  }
}

class Interpreter {
  constructor(text) {
    this.text = this.handle_whitespace(text);
    this.pos = 0;
    this.current_token = null;
  }

  error() {
    throw "Error parsing input";
  }
  handle_whitespace(text) {
    text = text.replace(/\s*/g, "");
    const op = text.match(/[\+-]/g)[0];
    text = text.split(op);
    text.splice(1, 0, op);
    return text;
  }
  get_next_token() {
    let text = this.text;
    let token, current_char;

    if (this.pos > text.length - 1) {
      return new Token(EOF, null);
    }

    current_char = text[this.pos];

    if (isDigit(current_char)) {
      token = new Token(INTEGER, Number(current_char));
      this.pos += 1;
      return token;
    }
    if (current_char === "-") {
      token = new Token(SUBTRACTION, current_char);
      this.pos += 1;
      return token;
    }

    this.error();
  }

  eat(token_type) {
    if (this.current_token.type === token_type) {
      this.current_token = this.get_next_token();
    } else {
      this.error();
    }
  }

  expr() {
    this.current_token = this.get_next_token();

    let left = this.current_token;
    this.eat(INTEGER);

    let op = this.current_token;
    this.eat(SUBTRACTION);

    let right = this.current_token;
    this.eat(INTEGER);

    if (op.type === SUBTRACTION) {
      return left.value - right.value;
    }
    this.error();
  }
}

let interpreter = new Interpreter("3-5");
console.log(interpreter.expr()); //output: -2
