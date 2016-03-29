import React from 'react';
import ReactDOM from 'react-dom';
import { RRule, RRuleSet, rrulestr } from '../lib/rrule/rrule';
import * as Constants from '../data/constants.js';

import Accounts from './accounts.js';
import Transactions from './transactions.js';

import accountData from '../data/accounts.json';
import transactionData from '../data/transactions.json';
import recurrenceData from '../data/recurrences.json';

class App extends React.Component {
    constructor() {
        super();

        // ummmm
        this.displayAccounts = this.displayAccounts.bind(this);
        this.displayTransactions = this.displayTransactions.bind(this);

        this.state = {
            accounts: accountData,
            transactions: transactionData,
            recurrences: recurrenceData,
            view: Constants.VIEWS.transactions
        };
    }

    componentDidMount() {
        console.log(...this.state);
        let rule = rrulestr(this.state.recurrences[0].rruleset.join("\n"))
        console.log(rule.all().map(date => date.toJSON()));
    }

    displayAccounts() {
        this.setState({
            view: Constants.VIEWS.accounts
        });
    }

    displayTransactions() {
        this.setState({
            view: Constants.VIEWS.transactions
        });
    }

    render() {
        let mainContent;

        switch (this.state.view) {
            case Constants.VIEWS.accounts:
                mainContent = <Accounts accounts={this.state.accounts} transactions={this.state.transactions}/>;
                break;
            case Constants.VIEWS.transactions:
                mainContent = <Transactions accounts={this.state.accounts} transactions={this.state.transactions}/>;
                break;
            default:
                mainContent = <div class="error">View does not exist.</div>;
                break;
        }

        return (
            <div id="budgie">
                <h1>Budgie</h1>
                {mainContent}
                <div id="stateToggles">
                    <button onClick={this.displayAccounts}>Show Accounts</button>
                    <button onClick={this.displayTransactions}>Show Transactions</button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('main'));
