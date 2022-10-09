import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE: "delete",
  CLEAR: "clear",
  EQUAL: "equal",
  CHOOSE_OPERATION: "choose-operation",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentValue: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentValue === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentValue.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentValue: `${state.currentValue || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentValue: null,
        };
      }
      if (state.currentValue == null) {
        return state;
      }
      if (state.currentValue.length === 1) {
        return {
          ...state,
          currentValue: null,
        };
      }
      return {
        ...state,
        currentValue: state.currentValue.slice(
          0,
          state.currentValue.length - 1
        ),
      };
    case ACTIONS.EQUAL:
      if (
        state.currentValue == null ||
        state.prevValue == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevValue: null,
        operation: null,
        currentValue: evaluate(state),
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentValue == null && state.prevValue == null) return state;
      if (state.prevValue == null) {
        return {
          ...state,
          operation: payload.operation,
          prevValue: state.currentValue,
          currentValue: null,
        };
      }
      if (state.currentValue == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        prevValue: evaluate(state),
        operation: payload.operation,
        currentValue: null,
      };

    default:
      return {};
  }
}
function evaluate({ currentValue, prevValue, operation }) {
  const curr = parseFloat(currentValue);
  const prev = parseFloat(prevValue);

  if (isNaN(prev) || isNaN(curr)) return "";

  let result;

  switch (operation) {
    case "+":
      result = curr + prev;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = prev / curr;
      break;
    default:
      return "";
  }
  return result.toString();
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatValue(value) {
  if (value == null) return;
  const [integer, decimal] = value.split(".");
  if (decimal == null) return INTEGER_FORMATER.format(integer);
  return `${INTEGER_FORMATER.format(integer)}.${decimal}`;
}
function App() {
  const [{ currentValue, prevValue, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="result">
        <div className="prev-result">
          {formatValue(prevValue)}
          {operation}
        </div>
        <div className="current-result">{formatValue(currentValue)}</div>
      </div>
      <button
        className="AC-Equal"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE })}>Del</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="AC-Equal"
        onClick={() => dispatch({ type: ACTIONS.EQUAL })}
      >
        =
      </button>
    </div>
  );
}
export default App;
