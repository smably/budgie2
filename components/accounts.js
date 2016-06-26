import React from 'react';

class Accounts extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.object.isRequired,
  }

  renderAccountRows = () => {
    let account, accountIDs = Object.keys(this.props.accounts);

    return accountIDs.map((accountID) => {
      account = this.props.accounts[accountID];

      return (
        <tr key={accountID}>
          <td>{account.label}</td>
          <td>{account.isSource ? "Y" : "N"}</td>
          <td>{account.isSink ? "Y" : "N"}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <h2>Accounts</h2>
        <table id="data">
          <thead>
            <tr>
              <td>Name</td>
              <td>Is Source?</td>
              <td>Is Destination?</td>
            </tr>
          </thead>
          <tbody>
            {this.renderAccountRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Accounts;
