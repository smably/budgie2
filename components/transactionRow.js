import React from 'react';
import moment from 'moment/src/moment';

let accounting = require('accounting');

class TransactionRow extends React.Component {
  static propTypes = {
    transaction: React.PropTypes.object,
    getPrettyDate: React.PropTypes.func
  }

  render() {
    let t = this.props.transaction;

    return (
      <tr data-transaction-id={t.id} onClick={(e) => e.target.closest('tr').classList.toggle("selected")}>
        <td>{this.props.getPrettyDate(t.date)}</td>
        <td>{t.label}</td>
        <td>{t.source}</td>
        <td>{t.sink}</td>
        <td className="amount">{accounting.formatMoney(t.amount / 100, "$", 2)}</td>
      </tr>
    );
  }
}

export default TransactionRow;
