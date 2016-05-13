import React from 'react';

class Accounts extends React.Component {
    static propTypes = {
        accounts: React.PropTypes.array
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
                    {this.props.accounts.map((account) =>
                        <tr key={account.id}>
                            <td>{account.label}</td>
                            <td>{account.isSource ? "Y" : "N"}</td>
                            <td>{account.isSink ? "Y" : "N"}</td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
        );
    }
}

export default Accounts;
