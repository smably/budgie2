import React from 'react';
import moment from 'moment/src/moment';

let accounting = require('accounting');

class Transactions extends React.Component {
    buildNewTransaction(transactions) {
        let maxTransactionId = Math.max.apply(Math, transactions.map(t => parseInt(t.id)));
        let thisTransactionId = String("0000" + (maxTransactionId + 1)).slice(-5);

        return {
            "id": thisTransactionId,
            "amount": 10000,
            "source": "00002",
            "sink": "00003",
            "label": "Transaction #" + parseInt(thisTransactionId) + " from Primary to Secondary",
            "date": moment().format('YYYY-MM-DD') + "00:00:00.000Z"
        };
    }

    render() {
        let addTransaction = this.props.addTransactionCallback;

        return (
            <div>
                <h2>Transactions</h2>

                <button onClick={() => addTransaction(this.buildNewTransaction(this.props.transactions)) }>Add Transaction</button>
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
                    {this.props.transactions.map((transaction) =>
                        <tr key={transaction.id}>
                            <td>{moment(transaction.date).format('YYYY-MM-DD')}</td>
                            <td>{transaction.label}</td>
                            <td>{transaction.source}</td>
                            <td>{transaction.sink}</td>
                            <td className="amount">{accounting.formatMoney(transaction.amount / 100, "$", 2)}</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        );
    }
}

Transactions.propTypes = {
    accounts: React.PropTypes.array,
    transactions: React.PropTypes.array,
    recurrences: React.PropTypes.array,
    addTransactionCallback: React.PropTypes.func
}

export default Transactions;
