import { createStore } from "redux";
import { combineReducers } from "redux";
import { authentication } from "../reducers/authenticationReducer";
import { registration } from "../reducers/registerReducer";
import { alert } from "../reducers/alertReducer";
import { order } from "../reducers/orderReducer";
import { mainHeader } from "../reducers/mainHeaderReducer";

const rootReducer = combineReducers({
  authentication,
  registration,
  alert,
  order,
  mainHeader,
});

export const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
