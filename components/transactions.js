import React from 'react';
import moment from 'moment/src/moment';

import TransactionRow from './transactionRow';

class Transactions extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.object,
    transactions: React.PropTypes.array,
    recurrences: React.PropTypes.object,
    addTransactionCallback: React.PropTypes.func
  }

  deleteTransactions = () => {
    let selectedRows = [...document.querySelectorAll("#data .selected")];
    let deleteTransaction = this.props.deleteTransactionCallback;

    selectedRows.forEach(selectedRow => {
      deleteTransaction(selectedRow.getAttribute("data-transaction-id"));
    });
  }

  buildNewTransaction = () => {
    let maxTransactionId = Math.max.apply(Math, this.props.transactions.map(t => parseInt(t.id)));
    let thisTransactionId = String("0000" + (maxTransactionId + 1)).slice(-5);
    let amount = this.newTransactionAmountField.value.replace(/[^\d.-]/g, "");
    let date = moment(this.newTransactionDateField.value);
    date = date.isValid() ? date.format('YYYY-MM-DD') + "T00:00:00.000Z" : null;

    return {
      "id": thisTransactionId,
      "amount": parseInt((amount * 100).toFixed()),
      "source": this.newTransactionSourceField.value,
      "sink": this.newTransactionDestinationField.value,
      "label": this.newTransactionLabelField.value,
      "date": date
    };
  }

  validateAndAddTransaction = () => {
    let newTransaction = this.buildNewTransaction();

    let accountIDs = Object.keys(this.props.accounts);
    let sourceIsInvalid = accountIDs.indexOf(newTransaction.source) === -1;
    let sinkIsInvalid = accountIDs.indexOf(newTransaction.sink) === -1;

    if (!newTransaction.date) {
      console.log("Error: invalid date");
      return;
    }

    if (newTransaction.label === "") {
      console.log("Error: label cannot be blank");
      return;
    }

    if (sourceIsInvalid || sinkIsInvalid) {
      console.log("Error: invalid source or destination");
      return;
    }

    if (newTransaction.source === newTransaction.sink) {
      console.log("Error: source and destination cannot be the same");
      return;
    }

    if (newTransaction.amount === 0) {
      console.log("Error: invalid amount");
      return;
    }

    this.props.addTransactionCallback(newTransaction);
  }

  getPrettyDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
  }

  getNewTransactionRow = () => {
    return (
      <tr id="newTransactionRow">
        <td><input type="text" placeholder="Date" defaultValue={this.getPrettyDate()} ref={ref => this.newTransactionDateField = ref} /></td>
        <td><input type="text" placeholder="Label" ref={ref => this.newTransactionLabelField = ref} /></td>
        <td><input type="text" placeholder="Source" ref={ref => this.newTransactionSourceField = ref} /></td>
        <td><input type="text" placeholder="Destination" ref={ref => this.newTransactionDestinationField = ref} /></td>
        <td><input type="text" placeholder="Amount" ref={ref => this.newTransactionAmountField = ref} /></td>
      </tr>
    );
  }

  render() {
    let sourceAccount, sinkAccount;
    let getPrettyDate = this.getPrettyDate;

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
          </tr>
        </thead>
        <tbody>
          {this.props.transactions.map(t =>
            <TransactionRow
              key={t.id}
              transaction={t}
              source={this.props.accounts[t.source]}
              sink={this.props.accounts[t.sink]}
              getPrettyDate={getPrettyDate} />
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
