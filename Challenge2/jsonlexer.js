export const Tokentypes = {
  LEFT_CURL: "LEFT_CURL",
  RIGHT_CURL: "RIGHT_CURL",
  LEFT_BRAC: "LEFT_BRAC",
  RIGHT_BRAC: "RIGHT_BRAC",
  STRING: "STRING",
  NUMBER: "NUMBER",
  COMMA: "COMMA",
  COLON: "COLON",
  EOF: "EOF",
};
export class Lexer {
  #stream = "";
  #cursor = 0;
  tokens = [];
  #at() {
    return this.#stream[this.#cursor];
  }

  tokenize(input = "") {
    this.#stream = input;
    this.#cursor = 0;
    while (this.#cursor < this.#stream.length) {
      switch (this.#at()) {
        case " ":
        case "\n":
        case "\r":
          break;
        case "{":
          this.tokens.push({ type: Tokentypes.LEFT_CURL, value: "{" });
          break;
        case "[":
          this.tokens.push({ type: Tokentypes.LEFT_BRAC, value: "{" });
          break;
        case "}":
          this.tokens.push({ type: Tokentypes.RIGHT_CURL, value: "}" });
          break;
        case "]":
          this.tokens.push({ type: Tokentypes.RIGHT_BRAC, value: "}" });
          break;
        case '"':
          this.#cursor++;
          let str = '"';
          while (this.#at() != '"') {
            str += this.#at();
            this.#cursor++;
          }
          str += this.#at();
          this.tokens.push({ type: Tokentypes.STRING, value: str });
          break;
        case ",":
          this.tokens.push({ type: Tokentypes.COMMA, value: "," });
          break;
        case ":":
          this.tokens.push({ type: Tokentypes.COLON, value: ":" });
          break;
        default:
          let num = this.#at();
          //   let onedot = false;  wrong number
          this.#cursor++;
          while (this.#isNumeric(this.#at())) {
            num += this.#at();
            this.#cursor++;
            if (this.#at() == ".") {
              num += this.#at();
              this.#cursor++;
            }
          }
          this.tokens.push({ type: Tokentypes.NUMBER, value: num });
      }
      this.#cursor++;
    }
    this.tokens.push({ type: Tokentypes.EOF, value: "EOF" });
    return this.tokens;
  }

  #isNumeric(input) {
    return input.charCodeAt(0) >= 48 && input.charCodeAt(0) <= 57;
  }
}


