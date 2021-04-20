import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transactions';
import BuyPage from './components/BuyPage';
import SellPage from './components/SellPage';
import QuotePage from './components/QuotePage';
import Header from './components/Header';
import UserContext from './context/UserContext';
import TransactionsContext from './context/TransactionsContext';
import Axios from 'axios';
import Home from './components/Home';
import LoadingPage from './components/LoadingPage';

function App() {
  const [userData, setUserData] = useState({
    token: localStorage.getItem('auth-token'),
    user: localStorage.getItem('user')
  })
  const API_ADDRESS = "https://cs50finance-backend.herokuapp.com/";
  const [transactionsData, setTransactionsData] = useState({
    'transactions': [],
    'cash': 0,
  })
  const [summaryData, setSummaryData] = useState({
    'shares': {},
    'cash': 0
  })


  const getTransactionsData = async () => {
    const token = localStorage.getItem('auth-token')
    if (!token) return;
    try {
      const res = await Axios.get('https://cs50finance-backend.herokuapp.com/finance/transactions',
        { headers: { 'x-auth-token': token } });
      if (res.data) {
        console.log('data retreived : ', res)
        /* const reqData = {
          'cash': res.data.data['cash'].toFixed(2),
          'transactions': []
        }
        res.data.data['transactions'].forEach(value => {
          reqData['transactions'].push([
            value['type'],
            [value['ttime'],
            value['stockid'],
            value['stockname'],
            value['price'],
            value['qty'],
            (value['price'] * value['qty'])]])
        }) */
        setTransactionsData(res.data.data)

        let shares = res.data.data['transactions'].reduce(
          function (a, b) {
            let tdata;
            if (a.has(b.stockid)) {
              tdata = a.get(b.stockid)
            }
            else {
              tdata = {
                'id': b.stockid,
                'name': b.stockname,
                'qty': 0
              };
            }
            console.log('current data', tdata);
            if (b.type === 'b') {
              tdata['qty'] += b.qty
            }
            else {
              tdata['qty'] -= b.qty
            }
            a.set(b.stockid, tdata)
            return a;
          },
          new Map())
        console.log(shares)
        let shares_data = {}
        let keys = shares.keys()
        let stock_ids = []
        for (let key of keys) {
          stock_ids.push(key);
        } for (let entry of shares.entries()) {
          let key = entry[0]
          let value = entry[1]
          shares_data[key] = value
        }

        let summary = {
          'cash': res.data.data.cash,
          'shares': shares_data
        }
        setSummaryData(summary)
      }
    }
    catch {
      console.log('something went wrong')
    }
  }

  const checkLoggedIn = async () => {
    let token = localStorage.getItem('auth-token');
    console.log('in app.js : ', token)
    if (token === null) {
      localStorage.setItem('auth-token', '')
      localStorage.setItem('user', '')
      token = ""
    }
    try {
      const tokenRes = await Axios.get('https://cs50finance-backend.herokuapp.com/auth/',
        { headers: { 'x-auth-token': token } });
      console.log(tokenRes);
      if (tokenRes.data) {
        console.log('data retreived : ', tokenRes.data, token)
        setUserData({ token, user: tokenRes.data['id'], uname: tokenRes.data['uname'] })
      }
    }
    catch {
      console.log('something went wrong')
    }
  }


  useEffect(() => {
    checkLoggedIn();
    getTransactionsData();
  }, [])

  return (
    <div className="App">
      <UserContext.Provider value={{ userData, setUserData }}>
        <TransactionsContext.Provider value={{ transactionsData, setTransactionsData, summaryData, setSummaryData }}>
          <BrowserRouter>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/transactions" exact component={Transactions} />
              <Route path="/buy" exact component={BuyPage} />
              <Route path="/sell" exact component={SellPage} />
              <Route path="/quote" exact component={QuotePage} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/loadingPage" exact component={LoadingPage} />
            </Switch>
          </BrowserRouter>
        </TransactionsContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
