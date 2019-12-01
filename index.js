const calculator = {
  displayValue: '0',
  history: '',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};


function calculate(firstOperand, secondOperand, operator) {
  switch (operator) {
    case '+': {
      return firstOperand + secondOperand;
    }
    case '−': {
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

function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) return;

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

function handleOperator(nextOperator) {
  const {
    firstOperand, displayValue, operator, history,
  } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    const re = new RegExp(`[${operator}]$`, 'g');
    calculator.history = history.replace(re, nextOperator);
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    calculator.firstOperand = inputValue;
  }
  if (operator) {
    const result = parseFloat(calculate(firstOperand, inputValue, operator).toFixed(5));

    calculator.displayValue = String(result);
    calculator.firstOperand = result;
  }


  calculator.history = history === '0' ? displayValue + nextOperator : history + displayValue + nextOperator;
  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}


function resetCalculator() {
  calculator.displayValue = '0';
  calculator.history = '';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function updateResult() {
  const result = document.querySelector('.result');
  result.textContent = calculator.displayValue;
}

function updateHistory() {
  const history = document.querySelector('.history');
  history.textContent = calculator.history.replace(/[^0-9.]/g, ((match) => ` ${match} `));
  history.scrollTop = history.scrollHeight;
}

function changeSign() {
  const { displayValue } = calculator;
  if (displayValue === '0') {
    return;
  }
  calculator.displayValue = String(-1 * parseFloat(displayValue));
}

function deleteLastdigit() {
  const { displayValue } = calculator;

  if (displayValue === '0') {
    return;
  }
  if (displayValue.length === 1) {
    calculator.displayValue = '0';
    return;
  }
  calculator.displayValue = displayValue.substr(0, displayValue.length - 1);
}

const buttons = document.querySelector('.buttons');
buttons.addEventListener('mousedown', (event) => {
  const { target } = event;

  switch (target.dataset.type) {
    case 'operator': {
      handleOperator(target.value);
      updateResult();
      updateHistory();
      return;
    }
    case 'decimal': {
      inputDecimal(target.value);
      updateResult();
      return;
    }
    case 'clear': {
      resetCalculator();
      updateResult();
      updateHistory();
      return;
    }
    case 'del': {
      deleteLastdigit();
      updateResult();
      return;
    }
    case 'plusmin': {
      changeSign();
      updateResult();
      return;
    }
    default: {
      inputDigit(target.value);
      updateResult();
    }
  }
});


window.onmouseup = () => {
  Array.from(buttons.children).map((button) => button.classList.remove('active'));
};
