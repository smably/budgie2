import React from 'react';
import moment from 'moment/src/moment';

let accounting = require('accounting');

class Transactions extends React.Component {
    render() {
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
    recurrences: React.PropTypes.array
}

export default Transactions;
