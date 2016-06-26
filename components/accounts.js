import React from 'react';

class Accounts extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.object.isRequired,
    addAccountCallback: React.PropTypes.func.isRequired,
    deleteAccountCallback: React.PropTypes.func.isRequired,
  }

  renderAccountRows = () => {
    let account, accountIDs = Object.keys(this.props.accounts);

    return accountIDs.map((accountID) => {
      account = this.props.accounts[accountID];

      return (
        <tr key={accountID} data-account-id={accountID} onClick={e => e.target.closest('tr').classList.toggle("selected")}>
          <td>{account.label}</td>
          <td>{account.isSource ? "Y" : "N"}</td>
          <td>{account.isSink ? "Y" : "N"}</td>
        </tr>
      );
    });
  }

  renderNewAccountRow = () => {
    return (
      <tr id="newAccountRow">
        <td><input type="text" placeholder="Label" ref={ref => this.newAccountLabelField = ref} /></td>
        <td><input type="checkbox" defaultChecked={true} ref={ref => this.newAccountSourceField = ref} /></td>
        <td><input type="checkbox" defaultChecked={true} ref={ref => this.newAccountDestinationField = ref} /></td>
      </tr>
    );
  }

  buildNewAccount = () => {
    let accountIDs = Object.keys(this.props.accounts);
    let maxAccountID = Math.max(...accountIDs.map(id => parseInt(id)));
    let thisAccountID = String("0000" + (maxAccountID + 1)).slice(-5);

    return {
      [thisAccountID]: {
        "label": this.newAccountLabelField.value,
        "isSource": this.newAccountSourceField.checked,
        "isSink": this.newAccountDestinationField.checked,
      }
    };
  }

  validateAndAddAccount = () => {
    let newAccount = this.buildNewAccount();

    this.props.addAccountCallback(newAccount);
  }

  deleteAccounts = () => {
    let selectedRows = [...document.querySelectorAll("#data .selected")];
    let deleteAccount = this.props.deleteAccountCallback;

    selectedRows.forEach(selectedRow => {
      deleteAccount(selectedRow.getAttribute("data-account-id"));
    });
  }

  render() {
    return (
      <div>
        <h2>Accounts</h2>
        <table id="data">
          <thead>
            <tr>
              <td>Account</td>
              <td>Is Source?</td>
              <td>Is Destination?</td>
            </tr>
          </thead>
          <tbody>
            {this.renderAccountRows()}
            {this.renderNewAccountRow()}
          </tbody>
        </table>
        <div id="accountOperations">
          <button
            id="deleteAccountButton"
            onClick={this.deleteAccounts}
          >-</button>
          <button
            id="addAccountButton"
            onClick={this.validateAndAddAccount}
          >+</button>
        </div>
      </div>
    );
  }
}

export default Accounts;
