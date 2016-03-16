const accounts = (state, action) => {
    switch (action.type) {
        case 'RECEIVE_ACCOUNTS':
            return action.accounts;
            break;
        default:
            return state;
    }
}
