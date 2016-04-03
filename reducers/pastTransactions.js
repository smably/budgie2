const pastTransactions = (state, action) => {
    switch (action.type) {
        case 'RECEIVE_PAST_TRANSACTIONS':
            return action.transactions;
            break;
        case 'ADD_PAST_TRANSACTION':
            return [...state.transactions, action.transaction];
            break;
        default:
            return state;
    }
}
