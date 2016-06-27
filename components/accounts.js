import React from 'react';

class Accounts extends React.Component {
  static propTypes = {
    accounts: React.PropTypes.object.isRequired,
    transactions: React.PropTypes.array.isRequired,
    addAccountCallback: React.PropTypes.func.isRequired,
    deleteAccountCallback: React.PropTypes.func.isRequired,
  }

  toggleSelectedAccount = (e) => {
    e.target.closest('tr').classList.toggle("selected");

    this.updateDeleteButtonState();
  }

  updateDeleteButtonState = (override) => {
    let hasAccountsSelected = typeof override === "boolean" ? override : (document.querySelector("#data .selected") != null);
    document.getElementById("deleteAccountButton").classList.toggle("visible", hasAccountsSelected);
  }

  renderAccountRows = () => {
    let account, accountIDs = Object.keys(this.props.accounts);
    let toggle = this.toggleSelectedAccount;

    return accountIDs.map(accountID => {
      account = this.props.accounts[accountID];

      return (
        <tr key={accountID} data-account-id={accountID} onClick={toggle} className="data-row">
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

  // TODO: store initial balance and date
  // TODO: flag to hide from account overview (source+sink accounts shown by default?)
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
    let newAccountObject = this.buildNewAccount();
    let newAccount = newAccountObject[Object.keys(newAccountObject)[0]]; // FIXME EW EW EW EW this needs to be a Map!!

    if (newAccount.label === "") {
      console.log("Error: label cannot be blank");
      return;
    }

    let accountLabelMatches = accountID =>
      (this.props.accounts[accountID].label.toLowerCase() === newAccount.label.toLowerCase());
    let accountExistsWithLabel = Object.keys(this.props.accounts).filter(accountLabelMatches).length > 0;

    if (accountExistsWithLabel) {
      console.log("Error: label must be unique");
      return;
    }

    if (!newAccount.isSource && !newAccount.isSink) {
      console.log("Error: must be either a source or a destination");
      return;
    }

    this.props.addAccountCallback(newAccountObject);
  }

  deleteAccounts = () => {
    let selectedRows = [...document.querySelectorAll("#data .selected")];
    let deleteAccount = this.props.deleteAccountCallback;

    let accountID, isFromAccount, isToAccount, accountLabel;
    let transactions = this.props.transactions;
    let skippedAccount = false;

    selectedRows.forEach(selectedRow => {
      accountID = selectedRow.getAttribute("data-account-id");
      isFromAccount = transaction => transaction.source === accountID;
      isToAccount = transaction => transaction.sink === accountID;

      if (transactions.some(t => isFromAccount(t) || isToAccount(t))) {
        skippedAccount = true;
        accountLabel = this.props.accounts[accountID].label;
        console.log(`Not deleting ${accountLabel}: account has transactions`)
      } else {
        deleteAccount(accountID);
      }
    });

    this.updateDeleteButtonState(skippedAccount);
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
