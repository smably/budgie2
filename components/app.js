import React from 'react';
import ReactDOM from 'react-dom';
import { RRule, RRuleSet, rrulestr } from '../lib/rrule/rrule';
import * as Constants from '../data/constants.js';

import Accounts from './accounts.js';
import Transactions from './transactions.js';

import accountData from '../data/accounts.json';
import transactionData from '../data/transactions.json';
import recurrenceData from '../data/recurrences.json';

const LOCAL_STORAGE_KEY = "budgie-0.1";

class App extends React.Component {
  updateLocalStorage = () => {
    console.log("updating local storage to", this.state);

    let pojoState = Object.assign({}, this.state, { accounts: [...this.state.accounts] });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pojoState))
  }

  addAccount = (newAccount) => {
    console.log("in addAccount, newAccount=", newAccount);

    this.setState(oldState => {
      return {
        accounts: new Map([...oldState.accounts, ...newAccount])
      };
    }, this.updateLocalStorage);
  }

  deleteAccount = (id) => {
    this.setState(oldState => {
      let newAccounts = new Map(oldState.accounts);
      newAccounts.delete(id);

      return {
        accounts: newAccounts
      }
    }, this.updateLocalStorage);
  }

  addTransaction = (newTransaction) => {
    this.setState(oldState => {
      let transactions = oldState.transactions;
      transactions.push(newTransaction);

      return {
        transactions: transactions
      };
    }, this.updateLocalStorage);
  }

  deleteTransaction = (id) => {
    this.setState(oldState => {
      return {
        transactions: oldState.transactions.filter(t => t.id != id)
      }
    }, this.updateLocalStorage);
  }

  expandRecurrences = (transactions, recurrences) => {
    let rule, transaction, occurrence;

    let occurrences = Object.keys(transactions).map(transactionID =>
      Object.assign({ id: transactionID }, transactions[transactionID])
    );

    Object.keys(recurrences).forEach(recurrenceID => {
      let recurrence = recurrences[recurrenceID];
      rule = rrulestr(recurrence.rruleset.join("\n"));
      transaction = transactions[recurrence.transactionID];
      occurrences = occurrences.concat(rule.all().map(date => {
        occurrence = Object.assign({}, transaction);
        occurrence.date = date.toJSON();
        occurrence.id = recurrence.transactionID + "_" + occurrence.date;
        return occurrence;
      }));
    });

    return occurrences.sort((a, b) => a.date.localeCompare(b.date));
  }

  displayAccounts = () => {
    this.setState({
      view: Constants.VIEWS.accounts
    }, this.updateLocalStorage);
  }

  displayTransactions = () => {
    this.setState({
      view: Constants.VIEWS.transactions
    }, this.updateLocalStorage);
  }

  constructor() {
    super();

    let localData = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (localData) {
      let initialState = JSON.parse(localData);
      initialState.accounts = new Map(initialState.accounts);

      this.state = initialState;
    } else {
      this.state = {
        accounts: new Map(accountData),
        transactions: this.expandRecurrences(transactionData, recurrenceData),
        recurrences: recurrenceData,
        view: Constants.VIEWS.transactions
      };
    }
  }

  componentDidMount() {
    console.log(...this.state);
  }

  render() {
    let mainContent;

    switch (this.state.view) {
      case Constants.VIEWS.accounts:
        mainContent = (
          <Accounts
            accounts={this.state.accounts}
            transactions={this.state.transactions}
            addAccountCallback={this.addAccount}
            deleteAccountCallback={this.deleteAccount} />
        );
        break;
      case Constants.VIEWS.transactions:
        mainContent = (
          <Transactions
            accounts={this.state.accounts}
            transactions={this.state.transactions}
            recurrences={this.state.recurrences}
            addTransactionCallback={this.addTransaction}
            deleteTransactionCallback={this.deleteTransaction} />
        );
        break;
      default:
        mainContent = <div className="error">View does not exist.</div>;
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
