import React, { useState, useEffect, useRef } from "react";
import { Calculator, History, RotateCcw, Save, Trash2 } from "lucide-react";

const ScientificCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  /* const [showHistory, setShowHistory] = useState(false); */
  const [isRadians, setIsRadians] = useState(true);
  const displayRef = useRef(null);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();

      if (e.key >= "0" && e.key <= "9") {
        inputNumber(e.key);
      } else if (e.key === ".") {
        inputNumber(".");
      } else if (e.key === "+") {
        performOperation("+");
      } else if (e.key === "-") {
        performOperation("-");
      } else if (e.key === "*") {
        performOperation("×");
      } else if (e.key === "/") {
        performOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        calculate();
      } else if (e.key === "Escape") {
        clear();
      } else if (e.key === "Backspace") {
        backspace();
      } else if (e.key === "(" || e.key === ")") {
        inputNumber(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, operation, previousValue, waitingForOperand]);

  const addToHistory = (calculation, result) => {
    const historyEntry = {
      id: Date.now(),
      calculation,
      result: result.toString(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
  };

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performCalculation(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performOperation = (op) => {
    inputOperation(op);
  };

  const performCalculation = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case "^":
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const calculation = `${previousValue} ${operation} ${inputValue}`;
      const newValue = performCalculation(previousValue, inputValue, operation);

      addToHistory(calculation, newValue);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const scientificFunction = (func) => {
    const value = parseFloat(display);
    let result;
    let calculation = `${func}(${value})`;

    switch (func) {
      case "sin":
        result = Math.sin(isRadians ? value : (value * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos(isRadians ? value : (value * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan(isRadians ? value : (value * Math.PI) / 180);
        break;
      case "ln":
        result = value > 0 ? Math.log(value) : 0;
        break;
      case "log":
        result = value > 0 ? Math.log10(value) : 0;
        break;
      case "√":
        result = value >= 0 ? Math.sqrt(value) : 0;
        calculation = `√(${value})`;
        break;
      case "x²":
        result = value * value;
        calculation = `${value}²`;
        break;
      case "1/x":
        result = value !== 0 ? 1 / value : 0;
        calculation = `1/(${value})`;
        break;
      case "!":
        result = factorial(Math.floor(Math.abs(value)));
        calculation = `${Math.floor(Math.abs(value))}!`;
        break;
      case "π":
        result = Math.PI;
        calculation = "π";
        break;
      case "e":
        result = Math.E;
        calculation = "e";
        break;
      default:
        result = value;
    }

    addToHistory(calculation, result);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  const factorial = (n) => {
    if (n < 0 || n > 170) return 0; // Prevent overflow
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const setHistoryValue = (value) => {
    setDisplay(value);
    setWaitingForOperand(true);
  };

  const handleHistoryClick = (result) => {
    setHistoryValue(result);
  };

  const Button = ({ onClick, className = "", children, ...props }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-lg font-medium transition-all duration-150 active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl  font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Calculator className="text-purple-400" />
            Scientific Calculator
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Advanced calculator with memory functions and history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              {/* Display */}
              <div className="mb-6">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-slate-400 text-sm">
                      {operation &&
                        previousValue !== null &&
                        `${previousValue} ${operation}`}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span
                        className={`px-2 py-1 rounded ${
                          memory !== 0
                            ? "bg-green-600 text-white"
                            : "bg-slate-600 text-slate-300"
                        }`}
                      >
                        M: {memory}
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          isRadians
                            ? "bg-blue-600 text-white"
                            : "bg-orange-600 text-white"
                        }`}
                      >
                        {isRadians ? "RAD" : "DEG"}
                      </span>
                    </div>
                  </div>
                  <input
                    ref={displayRef}
                    type="text"
                    value={display}
                    readOnly
                    className="w-full bg-transparent text-3xl font-mono text-white text-right focus:outline-none"
                    style={{ fontSize: display.length > 10 ? "24px" : "32px" }}
                  />
                </div>
              </div>

              {/* Button Grid */}
              <div className="grid grid-cols-6 gap-3">
                {/* Row 1 - Functions */}
                <Button
                  onClick={clear}
                  className="bg-red-600 hover:bg-red-700 text-white col-span-2"
                >
                  Clear
                </Button>
                <Button
                  onClick={backspace}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  ⌫
                </Button>
                <Button
                  onClick={() => setIsRadians(!isRadians)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isRadians ? "RAD" : "DEG"}
                </Button>
                <Button
                  onClick={() => performOperation("^")}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  x^y
                </Button>
                <Button
                  onClick={() => performOperation("÷")}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  ÷
                </Button>

                {/* Row 2 - Scientific Functions */}
                <Button
                  onClick={() => scientificFunction("sin")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  sin
                </Button>
                <Button
                  onClick={() => scientificFunction("cos")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  cos
                </Button>
                <Button
                  onClick={() => scientificFunction("tan")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  tan
                </Button>
                <Button
                  onClick={() => inputNumber("7")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  7
                </Button>
                <Button
                  onClick={() => inputNumber("8")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  8
                </Button>
                <Button
                  onClick={() => inputNumber("9")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  9
                </Button>

                {/* Row 3 */}
                <Button
                  onClick={() => scientificFunction("ln")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  ln
                </Button>
                <Button
                  onClick={() => scientificFunction("log")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  log
                </Button>
                <Button
                  onClick={() => scientificFunction("!")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  n!
                </Button>
                <Button
                  onClick={() => inputNumber("4")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  4
                </Button>
                <Button
                  onClick={() => inputNumber("5")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  5
                </Button>
                <Button
                  onClick={() => inputNumber("6")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  6
                </Button>

                {/* Row 4 */}
                <Button
                  onClick={() => scientificFunction("√")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  √
                </Button>
                <Button
                  onClick={() => scientificFunction("x²")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  x²
                </Button>
                <Button
                  onClick={() => scientificFunction("1/x")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  1/x
                </Button>
                <Button
                  onClick={() => inputNumber("1")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  1
                </Button>
                <Button
                  onClick={() => inputNumber("2")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  2
                </Button>
                <Button
                  onClick={() => inputNumber("3")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  3
                </Button>

                {/* Row 5 */}
                <Button
                  onClick={() => scientificFunction("π")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  π
                </Button>
                <Button
                  onClick={() => scientificFunction("e")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  e
                </Button>
                <Button
                  onClick={() => inputNumber("(")}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  (
                </Button>
                <Button
                  onClick={() => inputNumber(")")}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  )
                </Button>
                <Button
                  onClick={() => inputNumber("0")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  0
                </Button>
                <Button
                  onClick={() => inputNumber(".")}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  .
                </Button>

                {/* Row 6 - Operations */}
                <Button
                  onClick={() => performOperation("×")}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  ×
                </Button>
                <Button
                  onClick={() => performOperation("-")}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  -
                </Button>
                <Button
                  onClick={() => performOperation("+")}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  +
                </Button>
                <Button
                  onClick={calculate}
                  className="bg-green-600 hover:bg-green-700 text-white col-span-3"
                >
                  =
                </Button>
              </div>

              {/* Memory Functions */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                <Button
                  onClick={memoryStore}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  MS
                </Button>
                <Button
                  onClick={memoryRecall}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  MR
                </Button>
                <Button
                  onClick={memoryAdd}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  M+
                </Button>
                <Button
                  onClick={memoryClear}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  MC
                </Button>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <History className="w-5 h-5" />
                  History
                </h3>
                <Button
                  onClick={clearHistory}
                  className="bg-red-600 hover:bg-red-700 text-white p-2"
                  disabled={history.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">
                    No calculations yet
                  </p>
                ) : (
                  history.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-slate-800/50 rounded-lg p-3 cursor-pointer hover:bg-slate-700/50 transition-colors"
                      onClick={() => handleHistoryClick(entry.result)}
                    >
                      <div className="text-slate-300 text-sm font-mono">
                        {entry.calculation}
                      </div>
                      <div className="text-white font-semibold">
                        {entry.result}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {entry.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="mt-4 text-slate-400 text-xs text-center">
                  Click any result to use it
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
          <h4 className="text-white font-medium mb-2">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 text-sm">
            <div>
              <kbd className="bg-slate-700 px-1 rounded">0-9</kbd> Numbers
            </div>
            <div>
              <kbd className="bg-slate-700 px-1 rounded">+-*/</kbd> Operations
            </div>
            <div>
              <kbd className="bg-slate-700 px-1 rounded">Enter</kbd> Calculate
            </div>
            <div>
              <kbd className="bg-slate-700 px-1 rounded">Esc</kbd> Clear
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
