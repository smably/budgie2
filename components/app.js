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
        this.addTransaction = this.addTransaction.bind(this);

        this.state = {
            accounts: accountData,
            transactions: this.expandRecurrences(transactionData, recurrenceData),
            recurrences: recurrenceData,
            view: Constants.VIEWS.transactions
        };
    }

    addTransaction(newTransaction) {
        this.setState(oldState => {
            let transactions = oldState.transactions;
            transactions.push(newTransaction);

            return {
                transactions: transactions
            };
        });
    }

    componentDidMount() {
        console.log(...this.state);
    }

    expandRecurrences(transactions, recurrences) {
        let rule, transaction, occurrences = transactions, occurrence;
        recurrences.forEach(recurrence => {
            rule = rrulestr(recurrence.rruleset.join("\n"));
            console.log(transactions);
            transaction = transactions.filter(t => t.id === recurrence.transaction)[0];
            occurrences = occurrences.concat(rule.all().map(date => {
                occurrence = Object.assign({}, transaction);
                occurrence.date = date.toJSON();
                occurrence.id = occurrence.id + "_" + occurrence.date;
                return occurrence;
            }));
        });

        return occurrences.sort((a, b) => a.date.localeCompare(b.date));
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
                mainContent = <Accounts accounts={this.state.accounts} />;
                break;
            case Constants.VIEWS.transactions:
                mainContent = <Transactions
                    accounts={this.state.accounts}
                    transactions={this.state.transactions}
                    recurrences={this.state.recurrences}
                    addTransactionCallback={this.addTransaction} />;
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
