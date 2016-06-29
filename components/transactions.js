import React from 'react';
import moment from 'moment/src/moment';

import TransactionRow from './transactionRow';

class Transactions extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.object,
    transactions: React.PropTypes.array,
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
    let maxTransactionId = Math.max(...this.props.transactions.map(t => parseInt(t.id)));

    let transactionId = String("0000" + (maxTransactionId + 1)).slice(-5);
    let amount = this.newTransactionAmountField.value.replace(/[^\d.-]/g, "");
    let date = moment(this.newTransactionDateField.value);
    date = date.isValid() ? date.format('YYYY-MM-DD') + "T00:00:00.000Z" : null;

    return {
      "id": transactionId,
      "parentID": transactionId,
      "amount": parseInt((amount * 100).toFixed()),
      "source": this.newTransactionSourceField.value,
      "sink": this.newTransactionDestinationField.value,
      "label": this.newTransactionLabelField.value,
      "date": date,
      "displayDate": this.props.getDisplayDate(date)
    };
  }

  validateAndAddTransaction = () => {
    let newTransaction = this.buildNewTransaction();

    let sourceExists = this.props.accounts.has(newTransaction.source);
    let sinkExists = this.props.accounts.has(newTransaction.sink);
    let sourceIsSource = sourceExists ? this.props.accounts.get(newTransaction.source).isSource : false;
    let sinkIsSink = sinkExists ? this.props.accounts.get(newTransaction.sink).isSink : false;

    if (!newTransaction.date) {
      console.log("Error: invalid date");
      return;
    }

    if (newTransaction.label === "") {
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

    if (newTransaction.source === newTransaction.sink) {
      console.log("Error: source and destination cannot be the same");
      return;
    }

    if (newTransaction.amount <= 0) {
      console.log("Error: invalid amount");
      return;
    }

    this.props.addTransactionCallback(newTransaction);
  }

  getNewTransactionRow = () => {
    let renderAccountOptions = filter => [...this.props.accounts]
      .filter(([, account]) => filter(account))
      .map(([id, account]) => <option key={id} value={id}>{account.label}</option>)

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
    let balance;

    // TODO make initial balance row unselectable
    let startingTransaction = {
      id: "00000_initial",
      displayDate: "2016-01-01",
      label: "Initial balance",
      balances: {
        primary: 0
      }
    };

    let transactions = this.props.transactions.reduce((last, t) => {
      balance = last[last.length - 1].balances.primary;

      if (this.props.accounts.get(t.source).isPrimary) {
        balance -= t.amount;
      } else if (this.props.accounts.get(t.sink).isPrimary) {
        balance += t.amount;
      }

      t.balances = {
        primary: balance
      };

      return [...last, t];
    }, [startingTransaction]); // TODO initialize to startingBalance of primary

    console.log(transactions);

    return (
      <div>
        <h2>Transactions</h2>

        <table id="data">
        <thead>
          <tr>
            <td>Date</td>
            <td>Transaction</td>
            <td>From</td>
            <td>To</td>
            <td className="amount">Amount</td>
            <td className="amount">Balance</td>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t =>
            <TransactionRow
              key={t.id}
              transaction={t}
              source={this.props.accounts.get(t.source)}
              sink={this.props.accounts.get(t.sink)}
              balances={{ primary: 0 }}
              toggleSelectedTransaction={this.toggleSelectedTransaction} />
          )}
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
