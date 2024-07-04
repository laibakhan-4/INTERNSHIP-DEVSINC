let display= document.getElementById('display');
let historyList= document.getElementById('history-list');

function evaluateExpression(expression) {

    expression = expression.trim();    
    expression = expression.replace(/pi/g, '3.1415');
    expression = expression.replace(/e/g, '2.7182');
    
    // Evaluate using a recursive function that respects operator precedence
    return evaluateSubExpression(expression);
}

function evaluateSubExpression(expression) {
    let minPrecedenceIndex = -1;
    let minPrecedence = Infinity;
    let parenCount = 0;
    
    // Find the index of the first operator with the lowest precedence
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') {
            parenCount++;
        } else if (expression[i] === ')') {
            parenCount--;
        } else if (parenCount === 0) {
            const precedence = getOperatorPrecedence(expression[i]);
            if (precedence !== -1 && precedence < minPrecedence) {
                minPrecedenceIndex = i;
                minPrecedence = precedence;
            }
        }
    }
        
    // If no operator is found, evaluate the expression as a single value
    if (minPrecedenceIndex === -1) {
        if (expression.startsWith('sin(') && expression.endsWith(')')) {
            return Math.sin(parseFloat(expression.slice(4, -1)));
        } else if (expression.startsWith('cos(') && expression.endsWith(')')) {
            return Math.cos(parseFloat(expression.slice(4, -1)));
        } else if (expression.startsWith('tan(') && expression.endsWith(')')) {
            return Math.tan(parseFloat(expression.slice(4, -1)));
        } else if (expression.startsWith('sqrt(') && expression.endsWith(')')) {
            return Math.sqrt(parseFloat(expression.slice(5, -1)));
        } else {
            return parseFloat(expression);
        }
    }
        // Recursively evaluate the left and right sub-expressions
        const operator = expression[minPrecedenceIndex];
        const left = evaluateSubExpression(expression.slice(0, minPrecedenceIndex));
        const right = evaluateSubExpression(expression.slice(minPrecedenceIndex + 1));  
        
    // Apply the operator to the left and right sub-expressions
    switch (operator) {
        case '+':
            return left + right;
        case '-':
            return left - right;
        case '*':
            return left * right;
        case '/':
            if (right === 0) {
                throw new Error('Division by zero');
            }
            else{
                return left / right;
            }
        case '^':
            return Math.pow(left, right);
        default:
            throw new Error('Invalid operator');
    }
}

function findMatchingParenIndex(expression, startIndex) {
    let parenCount = 1;
    for (let i = startIndex + 1; i < expression.length; i++) {
        if (expression[i] === '(') {
            parenCount++;
        } else if (expression[i] === ')') {
            parenCount--;
            if (parenCount === 0) {
                return i;
            }
        }
    }
    throw new Error('Unbalanced parentheses');
}

function getOperatorPrecedence(operator) {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
        default:
            return -1;
    }
}

function appendToDisplay(input){
    display.value += input;
}

function clearAll(){
    display.value = "";

}

function clearLast(){
    display.value = display.value.slice(0,-1);
}

function calculate(){
    try{

        let result = evaluateExpression(display.value); //&
        result = result.toFixed(4);
        addToHistory(display.value + ' = ' + result);
        updateDisplay(display.value,result); 
    }catch(error){
        updateDisplay(display.value,'Error');
    }   
}

function addToHistory(entry){
    let li=document.createElement('li');
    li.innerHTML=`<div class="entry">${entry}</div> <button class="delete-btn" onclick="deleteHistoryEntry(this)">Delete</button>`;
    historyList.prepend(li);
}

function deleteHistoryEntry(button){
    let li= button.parentElement;
    historyList.removeChild(li);
    const successMessage = document.createElement('div');
    successMessage.textContent = 'History entry deleted!';
    historyList.parentElement.appendChild(successMessage);
    setTimeout(() => {
      successMessage.remove();
    }, 1000);
}

function clearAllHistory(){
    historyList.innerHTML="";
    const successMessage = document.createElement('div');
    successMessage.textContent = 'History cleared successfully!';
    historyList.parentElement.appendChild(successMessage);
    setTimeout(() => {
      successMessage.remove();
    }, 1000);
}

function updateDisplay(input, result) {
  display.value = input;
  document.getElementById('result').textContent = result;
}

display.addEventListener('input', function() {
    updateDisplay(this.value);
});
  
display.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      calculate();
    }
});

//Comment added in github
