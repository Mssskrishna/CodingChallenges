import { Tokentypes } from "./jsonlexer.js";

export class Parser {
  #tokens = [];
  #cursor = 0;

  #at() {
    return this.#tokens[this.#cursor];
  }

  #peek(n = 1) {
    return this.#tokens[this.#cursor + n];
  }

  parse(tok) {
    this.#tokens = tok;
    this.#cursor = 0;
    let first = this.#at().type;
    if (first !== Tokentypes.LEFT_CURL && first !== Tokentypes.LEFT_BRAC) {
      throw new Error(
        "A JSON payload should be an object or array, not a primitive"
      );
    }
    let result = this.#parse_element();
    if (this.#cursor < this.#tokens.length - 1) {
      throw new Error("Unexpected trailing tokens");
    }
    return result;
  }

  #parse_element() {
    return this.#parse_value();
  }

  #parse_value() {
    let token = this.#at();
    switch (token.type) {
      case Tokentypes.LEFT_CURL:
        return this.#parse_object();
      case Tokentypes.LEFT_BRAC:
        return this.#parse_array();
      case Tokentypes.STRING:
        this.#cursor++;
        return true;
      case Tokentypes.NUMBER:
        this.#cursor++;
        return true;
      case Tokentypes.TRUE:
      case Tokentypes.FALSE:
      case Tokentypes.NULL:
        this.#cursor++;
        return true;
      default:
        throw new Error(`Unexpected token ${token.type}`);
    }
  }

  #parse_object() {
    this.#consume(Tokentypes.LEFT_CURL);

    if (this.#at().type === Tokentypes.RIGHT_CURL) {
      this.#consume(Tokentypes.RIGHT_CURL);
      return true;
    }

    this.#parse_members();
    this.#consume(Tokentypes.RIGHT_CURL);
    return true;
  }

  #parse_array() {
    this.#consume(Tokentypes.LEFT_BRAC);

    if (this.#at().type === Tokentypes.RIGHT_BRAC) {
      this.#consume(Tokentypes.RIGHT_BRAC);
      return true;
    }

    this.#parse_elements();
    this.#consume(Tokentypes.RIGHT_BRAC);
    return true;
  }

  #parse_elements() {
    this.#parse_element();
    while (this.#at().type === Tokentypes.COMMA) {
      this.#consume(Tokentypes.COMMA);
      this.#parse_element();
    }
    return true;
  }

  #parse_member() {
    this.#consume(Tokentypes.STRING);
    this.#consume(Tokentypes.COLON);
    this.#parse_element();
    return true;
  }

  #parse_members() {
    this.#parse_member();
    while (this.#at().type === Tokentypes.COMMA) {
      this.#consume(Tokentypes.COMMA);
      this.#parse_member();
    }
    return true;
  }

  #consume(expectedtype) {
    let token = this.#at();
    if (!token || token.type !== expectedtype) {
      throw new Error(
        `Expected ${expectedtype}, found ${token?.type} (${
          token?.value
        }) at position ${this.#cursor}`
      );
    }
    this.#cursor++;
  }
}
