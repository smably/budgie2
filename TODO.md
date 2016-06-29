# Budgie 2 TODO

## 0.1
- Show correct initial balance
  - Account may have an initial balance from before the view window
  - Need to expand all transactions starting from the oldest initial balance
  - Can probably simplify to date, source, sink, amount for this calculation
- Add recurrences to new transactions
  - Menu to choose an existing recurrence pattern for now

## 0.2
- Show a dot or arrow next to today
  - Right of table? Between rows if no transactions today?
  - Maybe just bold the date column if today has transactions?
  - Or divide the table up somehow?
- Show month dividers
- Show balances for all accounts

## 0.3
- Add/remove recurrence patterns

## 0.4
- Edit transactions

## 0.5
- Remove recurrence instances

## 0.6
- Build single account view?

## 1.0
- Hook it up to a remote object store
- Add user accounts and authentication

## Post-1.0
- Figure out how to deal with exceptions
  - My rent is a different amount every month -- should it still be a recurring transaction?
  - Maybe what I need is just a way to duplicate an existing transaction
  - https://nylas.com/blog/rrules/
- Add transaction reconciliation
  - Transactions that have already happened shouldn't be connected to recurrences
- Add charting and reporting
- Add Redux, routing, CSS preprocessing or JSS
- Make it responsive
