import React from 'react';
import moment from 'moment/src/moment';

import { DISPLAY_DATE_FORMAT } from '../data/constants.js';

import TransactionRow from './transactionRow';

class Transactions extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.object,
    transactions: React.PropTypes.object,
    recurrences: React.PropTypes.object,
    getDisplayDate: React.PropTypes.func.isRequired,
    addTransactionCallback: React.PropTypes.func.isRequired,
    deleteTransactionCallback: React.PropTypes.func.isRequired,
  }

  toggleSelectedTransaction = (e) => {
    let parentID = e.target.closest('tr').dataset.parentId;
    let allWithParent = document.querySelectorAll(`tr.data-row[data-parent-id="${parentID}"]`);

    [...allWithParent].forEach(el => el.classList.toggle("selected"));
    this.updateDeleteButtonState();
  }

  updateDeleteButtonState = (override) => {
    let hasTransactionsSelected = typeof override === "boolean" ? override : document.querySelector("#data .selected") != null;
    document.getElementById("deleteTransactionButton").classList.toggle("visible", hasTransactionsSelected);
  }

  // FIXME: check whether all instances of a recurrence are selected
  // If not, update the rrule to add exceptions on the deleted dates
  deleteTransactions = () => {
    let selectedRows = [...document.querySelectorAll("#data .selected")];
    let deleteTransaction = this.props.deleteTransactionCallback;

    selectedRows.forEach(selectedRow => {
      deleteTransaction(selectedRow.getAttribute("data-transaction-id"));
    });

    this.updateDeleteButtonState(false);
  }

  // TODO: recurring transactions
  buildNewTransaction = () => {
    let transactionIDs = [...this.props.transactions.keys()];
    let maxTransactionId = Math.max(...transactionIDs.map(id => parseInt(id)));

    let transactionID = String("0000" + (maxTransactionId + 1)).slice(-5);
    let amount = this.newTransactionAmountField.value.replace(/[^\d.-]/g, "");
    let date = moment(this.newTransactionDateField.value);
    date = date.isValid() ? date.format("YYYY-MM-DD[T]00:00:00.000[Z]") : null;

    return [
      transactionID,
      {
        "parentID": transactionID,
        "amount": parseInt((amount * 100).toFixed()),
        "source": this.newTransactionSourceField.value,
        "sink": this.newTransactionDestinationField.value,
        "label": this.newTransactionLabelField.value,
        "date": date,
        "displayDate": this.props.getDisplayDate(date)
      }
    ];
  }

  validateAndAddTransaction = () => {
    let rawTransaction = this.buildNewTransaction();
    let [, transaction] = rawTransaction;

    let sourceExists = this.props.accounts.has(transaction.source);
    let sinkExists = this.props.accounts.has(transaction.sink);
    let sourceIsSource = sourceExists ? this.props.accounts.get(transaction.source).isSource : false;
    let sinkIsSink = sinkExists ? this.props.accounts.get(transaction.sink).isSink : false;

    if (!transaction.date) {
      console.log("Error: invalid date");
      return;
    }

    if (transaction.label === "") {
      console.log("Error: label cannot be blank");
      return;
    }

    if (!sourceExists || !sourceIsSource) {
      console.log("Error: invalid source account");
      return;
    }

    if (!sinkExists || !sinkIsSink) {
      console.log("Error: invalid destination account");
      return;
    }

    if (transaction.source === transaction.sink) {
      console.log("Error: source and destination cannot be the same");
      return;
    }

    if (transaction.amount <= 0) {
      console.log("Error: invalid amount");
      return;
    }

    this.props.addTransactionCallback(new Map([rawTransaction]));
  }

  getNewTransactionRow = () => {
    let renderAccountOptions = test => [...this.props.accounts].filter(
      ([, account]) => test(account)
    ).map(
      ([id, account]) => <option key={id} value={id}>{account.label}</option>
    );

    return (
      <tr id="newTransactionRow">
        <td><input type="text" placeholder="Date" defaultValue={this.props.getDisplayDate()} ref={ref => this.newTransactionDateField = ref} /></td>
        <td><input type="text" placeholder="Label" ref={ref => this.newTransactionLabelField = ref} /></td>
        <td>
          <select ref={ref => this.newTransactionSourceField = ref}>
            <option>- From -</option>
            {renderAccountOptions(a => a.isSource)}
          </select>
        </td>
        <td>
          <select ref={ref => this.newTransactionDestinationField = ref}>
            <option>- To -</option>
            {renderAccountOptions(a => a.isSink)}
          </select>
        </td>
        <td><input type="text" placeholder="Amount" ref={ref => this.newTransactionAmountField = ref} /></td>
        <td></td>
      </tr>
    );
  }

  render() {
    let lastTransaction, balance;
    let accumulateBalances = (prev, [id, t]) => {
      [, lastTransaction] = prev[prev.length - 1];
      balance = lastTransaction.balances.primary;

      if (this.props.accounts.get(t.source).isPrimary) {
        balance -= t.amount;
      } else if (this.props.accounts.get(t.sink).isPrimary) {
        balance += t.amount;
      }

      t.balances = {
        primary: balance
      };

      return [...prev, [id, t]];
    };

    let renderTransactionRow = ([id, t]) => (
      <TransactionRow
        key={id}
        id={id}
        transaction={t}
        source={this.props.accounts.get(t.source)}
        sink={this.props.accounts.get(t.sink)}
        balances={{ primary: 0 }}
        toggleSelectedTransaction={this.toggleSelectedTransaction} />
    );

    // TODO store balances for each account that has a balance
    let startingTransaction = [
      "00000_initial",
      {
        displayDate: "2016-01-01",
        label: "Initial balance",
        balances: {
          primary: 0
        }
      }
    ];

    // TODO initialize to startingBalance of primary
    let transactionRows = [...this.props.transactions]
      .reduce(accumulateBalances, [startingTransaction])
      .map(renderTransactionRow);

    return (
      <div>
        <h2>Transactions</h2>

        <table id="data">
        <thead>
          <tr>
            <td><svg className="icon icon-repeat"></svg>Date</td>
            <td>Transaction</td>
            <td>From</td>
            <td>To</td>
            <td className="amount">Amount</td>
            <td className="amount">Balance</td>
          </tr>
        </thead>
        <tbody>
          {transactionRows}
          {this.getNewTransactionRow()}
        </tbody>
        </table>
        <div id="transactionOperations">
          <button
            id="deleteTransactionButton"
            onClick={this.deleteTransactions}
          >-</button>
          <button
            id="addTransactionButton"
            onClick={this.validateAndAddTransaction}
          >+</button>
        </div>
      </div>
    );
  }
}

export default Transactions;
