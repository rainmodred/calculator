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
  } else if (displayValue.length < 16) {
    if (displayValue === 'Error') {
      calculator.displayValue = digit;
      return;
    }
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

    if (!Number.isFinite(result)) {
      calculator.history = '';
      calculator.displayValue = 'Error';
      calculator.firstOperand = null;
      calculator.waitingForSecondOperand = false;
      return;
    }

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
  target.classList.add('active');
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


function handleKeyboardInput(event) {
  const { code, key } = event;

  if (key === 'Enter' || code === 'Equal') {
    const elem = document.querySelector('button[value = "="]');
    elem.classList.add('active');
    handleOperator('=');
    updateResult();
    updateHistory();
    return;
  }
  if (code === 'Escape') {
    const elem = document.querySelector('button[data-type ="clear"]');
    elem.classList.add('active');
    resetCalculator();
    updateResult();
    updateHistory();
    return;
  }

  if (code === 'NumpadAdd' || key === '+') {
    const elem = document.querySelector('button[value = "+"]');
    elem.classList.add('active');
    handleOperator('+');
    updateResult();
    updateHistory();
    return;
  }
  if (code === 'NumpadSubtract' || key === '−') {
    const elem = document.querySelector('button[value = "−"]');
    elem.classList.add('active');
    handleOperator('−');
    updateResult();
    updateHistory();
    return;
  }
  if (code === 'NumpadMultiply' || key === '*') {
    const elem = document.querySelector('button[value = "×"]');
    elem.classList.add('active');
    handleOperator('×');
    updateResult();
    updateHistory();
    return;
  }
  if (code === 'NumpadDivide' || key === '/') {
    const elem = document.querySelector('button[value = "÷"]');
    elem.classList.add('active');
    handleOperator('÷');
    updateResult();
    updateHistory();
    return;
  }

  if (code === 'Backspace') {
    const elem = document.querySelector('button[data-type="del"]');
    elem.classList.add('active');
    deleteLastdigit();
    updateResult();
    return;
  }

  if (code === 'NumpadDecimal' || key === '.' || key === ',') {
    const elem = document.querySelector('button[value = "."]');
    elem.classList.add('active');
    inputDecimal('.');
    updateResult();
    return;
  }
  if (Number.isInteger(+key)) {
    const elem = document.querySelector(`button[value = "${key}"]`);
    elem.classList.add('active');
    inputDigit(key);
    updateResult();
  }
}


document.addEventListener('keydown', handleKeyboardInput);
window.onmouseup = () => {
  Array.from(buttons.children).map((button) => button.classList.remove('active'));
};

window.onkeyup = () => {
  Array.from(buttons.children).map((button) => button.classList.remove('active'));
};
