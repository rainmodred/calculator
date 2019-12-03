export default class Calculator {
  constructor() {
    this.displayValue = '0';
    this.history = '';
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
  }

  setHistory(value) {
    this.history = value;
  }

  calculate(firstOperand, secondOperand) {
    switch (this.operator) {
      case '+': {
        return firstOperand + secondOperand;
      }
      case '-': {
        return firstOperand - secondOperand;
      }
      case '×': {
        return firstOperand * secondOperand;
      }
      case '÷': {
        return firstOperand / secondOperand;
      }
      default: {
        return secondOperand;
      }
    }
  }


  inputDigit(digit) {
    if (this.waitingForSecondOperand === true) {
      this.displayValue = digit;
      this.waitingForSecondOperand = false;
    } else if (this.displayValue.length < 16) {
      if (this.displayValue === 'Error') {
        this.displayValue = digit;
        return;
      }

      this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
    }
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.displayValue);
    const { displayValue } = this;

    if (this.operator && this.waitingForSecondOperand) {
      const re = new RegExp(`[${this.operator}]$`, 'g');
      this.setHistory(this.history.replace(re, nextOperator));
      this.operator = nextOperator;
      return;
    }

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    }
    if (this.operator) {
      const result = parseFloat(this.calculate(this.firstOperand, inputValue).toFixed(5));

      if (!Number.isFinite(result)) {
        this.history = '';
        this.displayValue = 'Error';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        return;
      }

      this.displayValue = String(result);
      this.firstOperand = result;
    }


    this.history = this.history === '0' ? displayValue + nextOperator : this.history + displayValue + nextOperator;
    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }

  changeSign() {
    if (this.displayValue === '0') {
      return;
    }
    this.displayValue = String(-1 * parseFloat(this.displayValue));
  }

  inputDecimal() {
    if (this.waitingForSecondOperand === true) {
      return;
    }

    if (!this.displayValue.includes('.')) {
      this.displayValue += '.';
    }
  }

  deleteLastdigit() {
    if (this.displayValue === '0') {
      return;
    }
    if (this.displayValue.length === 1) {
      this.displayValue = '0';
      return;
    }
    this.displayValue = this.displayValue.substr(0, this.displayValue.length - 1);
  }

  resetCalculator() {
    this.displayValue = '0';
    this.history = '';
    this.firstOperand = null;
    this.waitingForSecondOperand = false;
    this.operator = null;
  }
}
