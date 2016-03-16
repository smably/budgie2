import { combineReducers } from 'redux';
import { accounts } from './accounts';
import { pastTransactions } from './pastTransactions';
import { futureTransactions } from './futureTransactions';

const budgieApp = combineReducers({
    accounts,
    pastTransactions,
    futureTransactions
});

export default budgieApp;
