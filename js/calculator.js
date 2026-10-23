/**
 * Retro OS Calculator
 * Classic pocket calculator with authentic button clicks and 7-segment/retro display.
 */

class RetroCalculator {
    constructor() {
        this.displayVal = '0';
        this.prevVal = null;
        this.operation = null;
        this.waitingForSecondOperand = false;
        this.displayEl = null;
    }

    init() {
        this.displayEl = document.getElementById('calc-display');
        const buttons = document.querySelectorAll('[data-calc-action]');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                window.retroSound.click();
                const action = btn.dataset.calcAction;
                const val = btn.dataset.calcVal;

                if (action === 'num') {
                    this.inputDigit(val);
                } else if (action === 'op') {
                    this.handleOperator(val);
                } else if (action === 'equals') {
                    this.calculate();
                } else if (action === 'clear') {
                    this.clear();
                } else if (action === 'clear-entry') {
                    this.clearEntry();
                } else if (action === 'decimal') {
                    this.inputDecimal();
                } else if (action === 'negate') {
                    this.negate();
                } else if (action === 'sqrt') {
                    this.sqrt();
                } else if (action === 'percent') {
                    this.percent();
                }

                this.updateDisplay();
            });
        });

        this.updateDisplay();
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayVal = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayVal = this.displayVal === '0' ? digit : this.displayVal + digit;
        }
    }

    inputDecimal() {
        if (this.waitingForSecondOperand) {
            this.displayVal = '0.';
            this.waitingForSecondOperand = false;
            return;
        }
        if (!this.displayVal.includes('.')) {
            this.displayVal += '.';
        }
    }

    handleOperator(nextOp) {
        const inputVal = parseFloat(this.displayVal);

        if (this.operation && this.waitingForSecondOperand) {
            this.operation = nextOp;
            return;
        }

        if (this.prevVal === null) {
            this.prevVal = inputVal;
        } else if (this.operation) {
            const result = this.compute(this.prevVal, inputVal, this.operation);
            this.displayVal = `${parseFloat(result.toFixed(7))}`;
            this.prevVal = result;
        }

        this.waitingForSecondOperand = true;
        this.operation = nextOp;
    }

    compute(first, second, op) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') {
            if (second === 0) {
                window.retroSound.error();
                return 0;
            }
            return first / second;
        }
        return second;
    }

    calculate() {
        if (this.operation === null || this.waitingForSecondOperand) return;
        const inputVal = parseFloat(this.displayVal);
        const result = this.compute(this.prevVal, inputVal, this.operation);
        this.displayVal = `${parseFloat(result.toFixed(7))}`;
        this.prevVal = null;
        this.operation = null;
        this.waitingForSecondOperand = false;
    }

    clear() {
        this.displayVal = '0';
        this.prevVal = null;
        this.operation = null;
        this.waitingForSecondOperand = false;
    }

    clearEntry() {
        this.displayVal = '0';
    }

    negate() {
        const val = parseFloat(this.displayVal);
        this.displayVal = String(-val);
    }

    sqrt() {
        const val = parseFloat(this.displayVal);
        if (val < 0) {
            window.retroSound.error();
            this.displayVal = 'Error';
        } else {
            this.displayVal = String(Math.sqrt(val));
        }
    }

    percent() {
        const val = parseFloat(this.displayVal);
        this.displayVal = String(val / 100);
    }

    updateDisplay() {
        if (this.displayEl) {
            this.displayEl.textContent = this.displayVal.slice(0, 12);
        }
    }
}

window.retroCalculator = new RetroCalculator();
