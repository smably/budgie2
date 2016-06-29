import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment/src/moment';
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
      let transactions = Object.assign([], oldState.transactions);
      transactions.push(newTransaction);
      transactions.sort(this.compareTransactions);

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

  compareTransactions = (a, b) => {
    let dateComparison = a.date.localeCompare(b.date);
    return dateComparison === 0 ? a.id.localeCompare(b.id) : dateComparison;
  }

  getDisplayDate = date => {
    return (date ? moment.utc(date) : moment()).format('YYYY-MM-DD')
  }

  fixDates = rruleSet => {
    let matches, dates;
    let datePattern = /(?:DTSTART|RDATE|EXDATE)=([\dTZ]+)/g;

    // Oh my, this is ugly: chop off the trailing Z to make it local, then convert back to UTC
    let toUTCString = date => moment(date.slice(0, -1)).utc().format("YYYYMMDD[T]HHmmss[Z]");

    return rruleSet.map(rrulestr => {
      dates = [];

      while (matches = datePattern.exec(rrulestr)) {
        dates.push(matches[1]);
      }

      dates.forEach(date => {
        rrulestr = rrulestr.replace(date, toUTCString(date));
      });

      return rrulestr;
    });
  }

  expandRecurrences = (transactions, recurrences) => {
    let transaction, recurrence, rrule, occurrences = [];

    Object.keys(transactions).forEach(transactionID => {
      transaction = transactions[transactionID];

      if (transaction.recurrenceID) {
        recurrence = recurrences[transaction.recurrenceID];
        rrule = rrulestr(this.fixDates(recurrence.rruleset).join("\n"));

        // TODO limit to date range
        occurrences = occurrences.concat(rrule.all().map(date => {
          let displayDate = this.getDisplayDate(date);

          return Object.assign({}, transaction, {
            id: `${transactionID}_${displayDate}`,
            parentID: transactionID,
            date: date.toJSON(),
            displayDate: displayDate
          });
        }));
      } else {
        occurrences.push(Object.assign({}, transaction, {
          id: transactionID,
          parentID: transactionID,
          displayDate: this.getDisplayDate(transaction.date)
        }));
      }
    });

    return occurrences.sort(this.compareTransactions);
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
            getDisplayDate={this.getDisplayDate}
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
