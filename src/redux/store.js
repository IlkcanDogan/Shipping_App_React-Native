import { createStore, combineReducers } from 'redux';
import filterReducer from './reducers/filterReducer';
import completeReducer from './reducers/complateReducer';

const reducers = combineReducers({ filter: filterReducer, completed: completeReducer });
const store = createStore(reducers);

export default store;