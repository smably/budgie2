import React from 'react';
import ReactDOM from 'react-dom';
import { RRule, RRuleSet, rrulestr } from '../lib/rrule/rrule';

import accounts from '../data/accounts.json';
import transactions from '../data/transactions.json';
import recurrences from '../data/recurrences.json';

class App extends React.Component {
    componentDidMount() {
        console.log(accounts, transactions, recurrences);
        let rule = rrulestr(recurrences[0].rruleset.join("\n"))
        console.log(rule.all().map(date => date.toJSON()));
    }

    render() {
        return <h1>Budgie</h1>;
    }
}

ReactDOM.render(<App/>, document.getElementById('main'));
