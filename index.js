import Calculator from './js/calculator.js';
import Controller from './js/controller.js';
import View from './js/view.js';

const calculator = new Calculator();
const view = new View();
const controller = new Controller(calculator, view);
// calculator.inputDigit('1');
// calculator.handleOperator('+');
// calculator.inputDigit('2');
// console.log(calculator);
// calculator.handleOperator('-');
// console.log(calculator);
