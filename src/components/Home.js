import React, { useContext, useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from '../context/UserContext';
import TransactionsContext from '../context/TransactionsContext';
import { CSSTransition } from 'react-transition-group';
import { price_of_shares } from '../services/fin_services';
import './Home.css';
// import Axios from 'axios';
import ErrorMsg from './ErrorMsg';

export default function Home() {

    const { userData } = useContext(UserContext)
    const { transactionsData, summaryData } = useContext(TransactionsContext)
    const fetching = useRef(false);
    const [data, setSharesData] = useState({
        'shares': [],
        'cash': 0,
        'total': 0
    })
    let share_keys = {}
    for (let key of Object.keys(summaryData.shares)) {
        share_keys[key] = 0
    }
    const [sharePrices, setSharePrices] = useState(share_keys)
    const [shareTotal, setShareTotal] = useState(0)




    const [status, setStatus] = useState('getting data from server')
    const history = useHistory()
    if (!userData || userData === null || !userData.user || userData.user === null || userData.user === '') {
        history.push('/login')
    }
    /* 
        const getData = async () => {
            if (transactionsData['transactions'].length < 1)
                return;
            const reqData = {
                'shares': []
            }
    
            let shares = transactionsData['transactions'].reduce(
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
                    //// console.log('current data', tdata);
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
            // // console.log(shares)
            // let shares_data = []
            /* let keys = shares.keys()
            let stock_ids = []
            for (let key of keys) {
                stock_ids.push(key);
            }
            // console.log('share keys => ', stock_ids)
            let prices = await price_of_shares(stock_ids, userData.token);
            
             
            let shares_total = 0
            for (let entry of shares.entries()) {
                let key = entry[0]
                let value = entry[1]
                /*     let price = prices[key] || 0;
                    value['price'] = price
                    const amount = price * value['qty']
                    shares_total += amount
                 
                shares_total += ((sharePrices[key] || 0) * value['qty'])
                reqData['shares'].push([value['id'], value['name'], value['qty']])
            }
            setShareTotal(shares_total)
            reqData['cash'] = summaryData.cash.toFixed(2)
            reqData['total'] = (summaryData.cash + shares_total).toFixed(2)
            setSharesData(reqData)
            setStatus('')
        }
     */



    useEffect(() => {
        const updatePrices = async function () {
            fetching.current = true;
            let keys = Object.keys(sharePrices)
            if (keys.length < 1)
                return;
            let stock_ids = []
            for (let key of keys) {
                stock_ids.push(key);
            }
            let prices = await price_of_shares(stock_ids, userData.token);
            let shares_total = 0
            let share_prices = {}
            for (let entry of Object.entries(summaryData.shares)) {
                let key = entry[0]
                let value = entry[1]
                let price = prices[key] || 0;
                share_prices[key] = price
                value['price'] = price
                const amount = price * summaryData['shares'][key]['qty']
                shares_total += amount
            }
            setShareTotal(shares_total)
            setSharePrices(share_prices)
            fetching.current = false
        }

        const intervalId = setInterval(() => {
            if (!fetching.current) {
                updatePrices().catch(error => console.log(error));
            }
        }, 60000);
        return () => {
            clearInterval(intervalId);
        };
    }, [])

    useEffect(() => {
        const updatePriceList = async function () {
            let summaryKeys = Object.keys(summaryData.shares)
            let sharePricesKeys = Object.keys(summaryData.shares)
            let stock_ids_add = []
            let stock_ids_remove = []
            for (let key of summaryKeys) {
                if (!(key in sharePricesKeys))
                    stock_ids_add.push(key);
            }
            for (let key of sharePricesKeys) {
                if (!(key in summaryKeys))
                    stock_ids_remove.push(key);
            }
            if (stock_ids_add.length < 1 && stock_ids_remove.length < 1)
                return;
            let share_prices = sharePrices
            for (let key of stock_ids_remove) {
                delete share_prices[key];
            }
            if (stock_ids_add.length < 1)
                return;
            let prices = await price_of_shares(stock_ids_add, userData.token);

            let shares_total = 0
            for (let entry of Object.entries(summaryData.shares)) {
                let key = entry[0]
                let value = entry[1]
                let price = (prices && prices[key]) || 0;
                share_prices[key] = price
                //  value['price'] = price
                const amount = price * value['qty']
                shares_total += amount
            }
            console.log('priceList Now=> ', share_prices)
            console.log('shareTotal Now=> ', shares_total)
            setShareTotal(shares_total)
            setSharePrices(share_prices)
        }

        updatePriceList()
    }, [summaryData])

    useEffect(() => {
        const getData = async () => {
            if (summaryData['shares'].length < 1)
                return;
            const reqData = {
                'shares': []
            }
            let shares = summaryData['shares']
            let shares_total = 0
            for (let entry of Object.entries(shares)) {
                let key = entry[0]
                let value = entry[1]
                shares_total += ((sharePrices[key] || 0) * value['qty'])
                reqData['shares'].push([value['id'], value['name'], value['qty']])
            }
            setShareTotal(shares_total)
            reqData['cash'] = summaryData.cash.toFixed(2)
            reqData['total'] = (summaryData.cash + shares_total).toFixed(2)
            setSharesData(reqData)
            setStatus('')
        }

        getData()
    }, [summaryData])
    return (
        <div>
            <h4 style={{ "textAlign": "right " }}>Welcome, {(userData && userData.uname) || 'user'}</h4>
            <ErrorMsg value={status}></ErrorMsg>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>NAME</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        data['shares'].map((value, i) => {
                            // console.log('rendering row ', value, i)
                            return <tr key={i}>
                                {
                                    value.map((value, index) => {
                                        return <td key={index}>{value}</td>
                                    })
                                }

                                <CSSTransition
                                    appear={true}
                                    timeout={2000}
                                    classNames="fadein"
                                    unmountOnExit={false}
                                >
                                    <td key={"" + i + "_price"}>{(sharePrices[value[0]] || 0).toFixed(2)}</td>
                                </CSSTransition>

                                <CSSTransition
                                    appear={true}
                                    timeout={2000}
                                    classNames="fadein"
                                    unmountOnExit={false}
                                >
                                    <td key={"" + i + "_amount"}>{((sharePrices[value[0]] || 0) * value[2]).toFixed(2)}</td>
                                </CSSTransition>
                            </tr>
                        })
                    }
                    <tr>
                        <td colSpan={4}>Shares</td>
                        <td>{(shareTotal).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan={4}>Cash</td>
                        <td>{data['cash']}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4}>Total</td>
                        <td>{(shareTotal + Number(data['cash'])).toFixed(2)}</td>
                    </tr>
                </tfoot>
                <caption><a href="https://iexcloud.io">Price Data provided by IEX Cloud</a></caption>
            </table >

        </div >
    )
}
