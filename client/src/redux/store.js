import { createStore, applyMiddleware } from "redux";

import toolReducer from "./reducers";

let middlewares = [];

const store = createStore(toolReducer, applyMiddleware(...middlewares));

export default store;
