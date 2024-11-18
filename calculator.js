let currentInput = '';
let backspaceClicked = 0;
let lastActionWasCalculation = false; // Flag to track if the last action was "="

// Update the display
function updateDisplay() {
  document.getElementById('display').textContent = currentInput || '0';
  
  if (currentInput !== '') {
    document.getElementById('ac-btn').textContent = '⌫';
  } else {
    document.getElementById('ac-btn').textContent = 'AC';
  }
}

// Handle number input
function inputNumber(number) {
  if (lastActionWasCalculation) {
    // Reset the input if last action was a calculation
    currentInput = '';
    lastActionWasCalculation = false;
  }

  const lastNum = currentInput.split(/[\+\-\*\/\%\=]/).pop();
  if (lastNum.length < 10) {
    if (currentInput === '0') {
      currentInput = number;
    } else {
      currentInput += number;
    }
  }
  
  updateDisplay();
  backspaceClicked = 0;
}

// Handle operator input
function inputOperator(operator) {
  if (currentInput) {
    if (lastActionWasCalculation) {
      lastActionWasCalculation = false;
    }
    if (['+', '-', '*', '/', '%'].includes(currentInput.slice(-1))) {
      currentInput = currentInput.slice(0, -1) + operator;
    } else {
      currentInput += operator;
    }
    updateDisplay();
    backspaceClicked = 0;
  }
}

// Handle decimal input
function inputDecimal() {
  const lastNum = currentInput.split(/[\+\-\*\/\%\=]/).pop();
  if (!lastNum.includes('.') || (lastNum.split('.')[1] && lastNum.split('.')[1].length < 4)) {
    currentInput += '.';
    updateDisplay();
    backspaceClicked = 0;
  }
}

// Calculate result
function calculateResult() {
  try {
    let result = eval(currentInput);
    result = result.toFixed(4);
    result = parseFloat(result).toString();
    if (result.length > 12) {
      result = parseFloat(result).toExponential(4);
    }
    currentInput = result;
    updateDisplay();
    document.getElementById('display').classList.add('fade-in');
    setTimeout(() => {
      document.getElementById('display').classList.remove('fade-in');
    }, 500);
    lastActionWasCalculation = true; // Set flag after calculation
  } catch (error) {
    currentInput = 'Error';
    updateDisplay();
  }
  backspaceClicked = 0;
}

// Clear display
function clearDisplay() {
  currentInput = '';
  updateDisplay();
  backspaceClicked = 0;
  lastActionWasCalculation = false;
}

// Handle backspace
function backspace() {
  if (currentInput === '') return;
  if (backspaceClicked === 0) {
    currentInput = currentInput.slice(0, -1);
    backspaceClicked++;
  } else if (backspaceClicked === 1) {
    currentInput = currentInput.slice(0, -1);
    backspaceClicked = 0;
  }
  updateDisplay();
}

// Toggle sign
function toggleSign() {
  if (currentInput) {
    if (currentInput[0] === '-') {
      currentInput = currentInput.slice(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateDisplay();
  }
}

// Handle keyboard input
function handleKeyboardInput(event) {
  const key = event.key;
  if (key >= '0' && key <= '9') {
    inputNumber(key);
  }
  if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
    inputOperator(key);
  }
  if (key === 'Enter') {
    calculateResult();
  }
  if (key === 'Backspace') {
    backspace();
  }
  if (key === 'ArrowUp' || key === 'ArrowDown') {
    toggleSign();
  }
}

document.addEventListener('keydown', handleKeyboardInput);
