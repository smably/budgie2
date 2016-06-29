import React from 'react';
import moment from 'moment/src/moment';

let accounting = require('accounting');

class TransactionRow extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    transaction: React.PropTypes.object.isRequired,
    source: React.PropTypes.object,
    sink: React.PropTypes.object,
    toggleSelectedTransaction: React.PropTypes.func.isRequired,
  }

  render() {
    let id = this.props.id;
    let t = this.props.transaction;
    let isRecurring = t.parentID && (t.parentID != t.id);
    let recurrenceIcon = <svg className="icon icon-repeat"><use xlinkHref="#icon-repeat"></use></svg>;
    let iconPlaceholder = <svg className="icon icon-repeat"></svg>;

    let source = this.props.source;
    let sink = this.props.sink;

    let amountIsNegative = (source && sink && source.isSink && !sink.isSource);
    let amountIsPositive = (source && sink && !source.isSink && sink.isSource);
    let amountClasses = "amount";
    let balanceClasses = "amount" + (t.balances.primary < 0 ? " neg" : "");
    let formatAmount = amount => accounting.formatMoney(amount / 100, "$", 2);

    if (amountIsPositive) {
      amountClasses += " pos";
    } else if (amountIsNegative) {
      amountClasses += " neg";
    }

    return (
      <tr data-transaction-id={id} data-parent-id={t.parentID} onClick={this.props.toggleSelectedTransaction} className="data-row">
        <td className="date">{isRecurring ? recurrenceIcon : iconPlaceholder}{t.displayDate}</td>
        <td>{t.label ? t.label : "-"}</td>
        <td>{source ? source.label : "-"}</td>
        <td>{sink ? sink.label : "-"}</td>
        <td className={amountClasses}>{t.amount ? formatAmount(t.amount) : "-"}</td>
        <td className={balanceClasses}>{formatAmount(Math.abs(t.balances.primary))}</td>
      </tr>
    );
  }
}

export default TransactionRow;
