import React from 'react';
import ReactDOM from 'react-dom';

import accounts from '../data/accounts.json';
import transactions from '../data/transactions.json';
import recurrences from '../data/recurrences.json';

class App extends React.Component {
    componentDidMount() {
        console.log(accounts, transactions, recurrences);
    }

    render() {
        return <h1>Budgie</h1>;
    }
}

ReactDOM.render(<App/>, document.getElementById('main'));
