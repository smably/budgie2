const futureTransactions = (state, action) => {
    switch (action.type) {
        case 'RECEIVE_FUTURE_TRANSACTIONS':
            return action.transactions;
            break;
        case 'ADD_FUTURE_TRANSACTION':
            return [...state.transactions, action.transaction];
            break;
        default:
            return state;
    }
}
