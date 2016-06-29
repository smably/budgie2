import React from 'react';
import moment from 'moment/src/moment';

let accounting = require('accounting');

class TransactionRow extends React.Component {
  static propTypes = {
    transaction: React.PropTypes.object.isRequired,
    source: React.PropTypes.object.isRequired,
    sink: React.PropTypes.object.isRequired,
    toggleSelectedTransaction: React.PropTypes.func.isRequired,
  }

  render() {
    let t = this.props.transaction;
    let isRecurring = t.parentID != t.id;
    let recurrenceIcon = <svg className="icon"><use xlinkHref="#icon-repeat"></use></svg>;

    return (
      <tr data-transaction-id={t.id} data-parent-id={t.parentID} onClick={this.props.toggleSelectedTransaction} className="data-row">
        <td>{t.displayDate} {isRecurring ? recurrenceIcon : null}</td>
        <td>{t.label}</td>
        <td>{this.props.source.label}</td>
        <td>{this.props.sink.label}</td>
        <td className="amount">{accounting.formatMoney(t.amount / 100, "$", 2)}</td>
      </tr>
    );
  }
}

export default TransactionRow;
