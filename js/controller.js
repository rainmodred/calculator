function addActiveClass(key) {
  const button = document.querySelector(`button[data-key="${key}"]`);
  button.classList.add('active');
}


export default class Controller {
  constructor(calculator, view) {
    this.calculator = calculator;
    this.view = view;


    this.keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Enter', '=', '-', '/', '+', '*', 'Escape', 'Backspace', '.'];
    this.buttons = document.querySelector('.buttons');
    this.buttons.addEventListener('mousedown', this.handleInput.bind(this));
    document.addEventListener('keydown', this.handleInput.bind(this));
    ['mouseup', 'keyup'].forEach((event) => {
      window.addEventListener(event, () => {
        Array.from(this.buttons.children).map((button) => button.classList.remove('active'));
      });
    });
  }


  handleInput(event) {
    const { target } = event;
    let key = '';

    if (event.type === 'keydown') {
      if (!this.keys.includes(event.key)) {
        return;
      }
      switch (event.key) {
        case 'Enter': {
          key = '=';
          addActiveClass(key);
          break;
        }
        case 'Escape': {
          key = 'clear';
          addActiveClass(key);
          break;
        }
        case 'Backspace': {
          key = 'del';
          addActiveClass(key);
          break;
        }
        case '*': {
          key = '×';
          addActiveClass(key);
          break;
        }
        case '/': {
          key = '÷';
          addActiveClass(key);
          break;
        }
        default: {
          key = event.key;
          addActiveClass(key);
          break;
        }
      }
    } else {
      key = target.dataset.key;
      target.classList.add('active');
    }

    switch (key) {
      case '+':
      case '-':
      case '×':
      case '÷':
      case '=':
      {
        this.calculator.handleOperator(key);
        this.view.updateResult(this.calculator.displayValue);
        this.view.updateHistory(this.calculator.history);
        break;
      }
      case '.': {
        this.calculator.inputDecimal(key);
        this.view.updateResult(this.calculator.displayValue);
        break;
      }
      case 'clear': {
        this.calculator.resetCalculator();
        this.view.updateResult(this.calculator.displayValue);
        this.view.updateHistory(this.calculator.history);
        break;
      }
      case 'del':
      case 'Backspace': {
        this.calculator.deleteLastdigit();
        this.view.updateResult(this.calculator.displayValue);
        break;
      }
      case 'plusmin': {
        this.calculator.changeSign();
        this.view.updateResult(this.calculator.displayValue);
        break;
      }
      default: {
        this.calculator.inputDigit(key);
        this.view.updateResult(this.calculator.displayValue);
      }
    }
  }
}
