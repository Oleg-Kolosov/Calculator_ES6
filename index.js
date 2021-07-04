class Calculator {
    constructor(input, output) {
        this.inputDisplay = input;
        this.outputDisplay = output;
        this.inputHistory = [];
    }

    clearAllHistory() {
        this.inputHistory.slice(0, -1);
        this.updateInputDisplay();
        this.updateOutputDisplay('0');
    }

    backspace() {
        switch (this.getLastInputType()) {
            case 'number':
                if (this.getLastInputValue.length > 1) {
                    this.editLastInput(
                        this.getLastInputValue().slice(0, -1),
                        'number'
                    );
                } else {
                    this.deleteLastInput();
                }
                break;
            case 'operator':
                this.deleteLastInput();
                break;
            default:
                return;
        }
    }

    changePercentToDecimal() {
        if (this.getLastInputType() === 'number') {
            this.editLastInput(this.getLastInputValue() / 100, 'number');
        }
    }

    insertNumber(value) {
        if (this.getLastInputType() === 'number') {
            this.appendToLastInput(value);
        } else if (
            this.getLastInputType() === 'operator' ||
            this.getLastInputType() === null
        ) {
            this.addNewInput(value, 'number');
        }
    }

    insertOperation(value) {
        switch (this.getLastInputType()) {
            case 'number':
                this.addNewInput(value, 'operator');
                break;
            case 'operator':
                this.editLastInput(value, 'operator');
                break;
            case 'equals':
                let output = this.getOutputValue();
                this.clearAllHistory();
                this.addNewInput(output, 'number');
                this.addNewInput(value, 'operator');
                break;
            default:
                return;
        }
    }

    negativeNumber() {
        if (this.getLastInputType() === 'number') {
            this.editLastInput(
                parseFloat(this.getLastInputValue() * -1),
                'number'
            );
        }
    }

    insertDecimalPoint() {
        if (
            this.getLastInputType() === 'number' &&
            !this.getLastInputValue().includes('.')
        ) {
            this.appendToLastInput('.');
        } else if (
            this.getLastInputValue() === 'operaition' ||
            this.getLastInputValue() === null
        ) {
            this.addNewInput('0.', 'number');
        }
    }

    genereteResult() {
        if (this.getLastInputType() === 'number') {
            const self = this;
            const simplifyExpression = function (currentExpression, operator) {
                
                if (currentExpression.indexOf(operator) === -1) {
                    return currentExpression;
                } else {
                    let operatorIdx = currentExpression.indexOf(operator);
                    let leftOperandIdx = operatorIdx - 1;
                    let rightOperandIdx = operatorIdx + 1;

                    let partialSolution = self.performOperation(
                        ...currentExpression.slice(
                            leftOperandIdx,
                            rightOperandIdx + 1
                        )
                    );

                    currentExpression.splice(
                        leftOperandIdx,
                        3,
                        partialSolution.toString()
                    );

                    return simplifyExpression(currentExpression, operator);
                }
            };
            let result = ['*', '+', '-', '/'].reduce(
                simplifyExpression,
                this.getAllInputValues()
            );

            this.addNewInput('=', 'equals');
            this.updateOutputDisplay(result.toString());
        }
    }

    // Helper functions
    getLastInputType() {
        return this.inputHistory.length === 0
            ? null
            : this.inputHistory[this.inputHistory.length - 1].type;
    }

    getLastInputValue() {
        return this.inputHistory.length === 0
            ? null
            : this.inputHistory[this.inputHistory.length - 1].value;
    }

    getAllInputValues() {
        return this.inputHistory.map(entry => entry.value);
    }

    getOutputValue() {
        return this.outputDisplay.value.replace(/,/g, '');
    }

    addNewInput(value, type) {
        this.inputHistory.push({ type: type, value: value.toString() });
        this.updateInputDisplay();
    }

    appendToLastInput(value) {
        this.inputHistory[
            this.inputHistory.length - 1
        ].value += value.toString();
        this.updateInputDisplay();
    }

    editLastInput(value, type) {
        this.inputHistory.pop();
        this.addNewInput(value, type);
    }

    deleteLastInput() {
        this.inputHistory.pop();
        this.updateInputDisplay();
    }

    updateInputDisplay() {
        this.inputDisplay.value = this.getAllInputValues().join(' ');
    }

    updateOutputDisplay(value) {
        this.outputDisplay.value = Number(value).toLocaleString('ru-RU');
    }

    performOperation(leftOperand, operation, rightOperand) {
        leftOperand = parseFloat(leftOperand);
        rightOperand = parseFloat(rightOperand);

        if (Number.isNaN(leftOperand) || Number.isNaN(rightOperand)) {
            return;
        }

        switch (operation) {
            case '*':
                return leftOperand * rightOperand;
            case '+':
                return leftOperand + rightOperand;
            case '-':
                return leftOperand - rightOperand;
            case '/':
                return leftOperand / rightOperand;
            default:
                return;
        }
    }
} // End Calculator Class definition

// Create bindings to access DOM elements
const inputDisplay = document.getElementById('history');
const outputDisplay = document.getElementById('result');

const allClearButton = document.querySelector('[data-all-clear]');
const backspaceButton = document.querySelector('[data-backspace]');
const percentButton = document.querySelector('[data-percent]');
const operationButtons = document.querySelectorAll('[data-operator]');
const numberButtons = document.querySelectorAll('[data-number]');
const negativeButton = document.querySelector('[data-negative]');
const decimalButton = document.querySelector('[data-decimal]');
const equalsButton = document.querySelector('[data-equals]');

// Create a new Calculator

const calculator = new Calculator(inputDisplay, outputDisplay);

// Add event handlers to calculator buttons

allClearButton.addEventListener('click', () => {
    calculator.clearAllHistory();
});

backspaceButton.addEventListener('click', () => {
    calculator.backspace();
});

percentButton.addEventListener('click', () => {
    calculator.changePercentToDecimal();
});

operationButtons.forEach(button => {
    button.addEventListener('click', e => {
        let { target } = e;
        calculator.insertOperation(target.dataset.operator);
    });
});

numberButtons.forEach(button => {
    button.addEventListener('click', e => {
        let { target } = e;
        calculator.insertNumber(target.dataset.number);
    });
});

negativeButton.addEventListener('click', () => {
    calculator.negativeNumber();
});

decimalButton.addEventListener('click', () => {
    calculator.insertDecimalPoint();
});

equalsButton.addEventListener('click', () => {
    calculator.genereteResult();
    console.log('calculator:', calculator)

});
