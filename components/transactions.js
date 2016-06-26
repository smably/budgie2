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

    buildNewTransaction = (transactions) => {
        let maxTransactionId = Math.max.apply(Math, transactions.map(t => parseInt(t.id)));
        let thisTransactionId = String("0000" + (maxTransactionId + 1)).slice(-5);

        return {
            "id": thisTransactionId,
            "amount": (this.newTransactionAmountField.value.replace(/[^\d.-]/g, "") * 100).toFixed(),
            "source": this.newTransactionSourceField.value,
            "sink": this.newTransactionDestinationField.value,
            "label": this.newTransactionLabelField.value,
            "date": moment(this.newTransactionDateField.value).format('YYYY-MM-DD') + "00:00:00.000Z"
        };
    }

    getPrettyDate = (date) => {
        return moment(date).format('YYYY-MM-DD');
    }

    getNewTransactionRow = () => {
        return (
            <tr id="newTransactionRow">
                <td><input type="text" placeholder="Date" value={this.getPrettyDate()} ref={(ref) => this.newTransactionDateField = ref} /></td>
                <td><input type="text" placeholder="Label" ref={(ref) => this.newTransactionLabelField = ref}  /></td>
                <td><input type="text" placeholder="Source" ref={(ref) => this.newTransactionSourceField = ref}  /></td>
                <td><input type="text" placeholder="Destination" ref={(ref) => this.newTransactionDestinationField = ref}  /></td>
                <td><input type="text" placeholder="Amount" ref={(ref) => this.newTransactionAmountField = ref}  /></td>
            </tr>
        );
    }

    render() {
        let sourceAccount, sinkAccount;
        let getPrettyDate = this.getPrettyDate;
        let addTransaction = this.props.addTransactionCallback;
        let deleteTransactions = this.deleteTransactions;

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
                        onClick={deleteTransactions}
                    >-</button>
                    <button
                        id="addTransactionButton"
                        onClick={() => addTransaction(this.buildNewTransaction(this.props.transactions)) }
                    >+</button>
                </div>
            </div>
        );
    }
}

export default Transactions;
