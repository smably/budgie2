const futureTransactions = (state, action) => {
    switch (action.type) {
        case 'RECEIVE_FUTURE_TRANSACTIONS':
            return action.transactions;
            break;
        default:
            return state;
    }
}
