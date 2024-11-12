import { createStore, applyMiddleware ,combineReducers} from "redux";
import thunk from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import projectReducer from './reducers/projectReducer';
import themeReducer from './reducers/themeReducer';


const rootReducer = combineReducers(
{ 
    projectR:projectReducer,
    themeR:themeReducer,
});

// initial states here
const initalState = {};

// middleware
const middleware = [thunk];

// creating store
export const store = createStore(
  rootReducer,
  initalState,
  applyMiddleware(...middleware)
);

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
