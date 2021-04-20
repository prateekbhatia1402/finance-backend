import React, {useState, useContext} from 'react';
import TransactionsContext from '../context/TransactionsContext';
import { useHistory } from 'react-router-dom'
import UserContext from '../context/UserContext';
import {buy} from '../services/fin_services';
import ErrorMsg from './ErrorMsg';

export default function BuyPage() {
    const { userData } = useContext(UserContext)
    const history = useHistory()
    const { transactionsData, setTransactionsData, summaryData, setSummaryData } = useContext(TransactionsContext)
    const [formMsg, setFormMsg] = useState("")
    const [stockId, setStockId] = useState("")
    const [stockIdMsg, setStockIdMsg] = useState("")
    const [stockQty, setStockQty] = useState(0)
    const [stockQtyMsg, setStockQtyMsg] = useState("")
    const submit = async (e) => {
        e.preventDefault();
        setFormMsg('')
        let check = true
        if (!stockId) {
            check = false
            setStockIdMsg('please fill stock id')
        }
        else {
            setStockIdMsg('')
        }
        if (!stockQty || stockQty < 0) {
            check = false
            setStockQtyMsg('please enter number of shares you want to buy, it cannot be less than 1')
        }
        else {
            setStockQtyMsg('')
        }
        if (check) {
            setFormMsg('processing request... ')
            const buyRes = await buy(stockId, stockQty, userData.token)
            console.log(buyRes)
            setFormMsg(buyRes[0])
            if (buyRes[0] === '') {
                setFormMsg(buyRes[1]['msg'])
                const transaction = buyRes[1]['data']
                let transactions = transactionsData
                let summary = summaryData
                transactions['transactions'].push(transaction)
                transactions['cash'] -= (transaction['price'] * transaction['qty'])
                setTransactionsData(transactions);
                summary['cash'] = transactions['cash']
                if (stockId in summary['shares']){
                    summary['shares'][stockId]['qty'] += transaction.qty;
                }
                else{
                    summary['shares'][stockId] = {
                        'id': transaction.stockid,
                        'qty': transaction.qty,
                        'name': transaction.stockname
                    }
                }
                setSummaryData(summary)
                history.push('/')
            }
        }
    }


    return (
    <form action="/buy" method="post" onSubmit={submit}>
        <ErrorMsg value={formMsg}></ErrorMsg>
        <div className="form-group">

            <label htmlFor="sid"> Stock ID : </label>
            <input autoComplete="on" autoFocus className="form-input" 
                name="symbol" placeholder="Stock Symbol" value={stockId}  onChange={
                (e) =>
                setStockId(e.target.value)
                } type="text"> 
            </input>
            <ErrorMsg value={stockIdMsg}></ErrorMsg>
        </div>
        <div className="form-group">

            <label htmlFor="qty"> Quantity : </label>
            <input autoComplete="off" autoFocus className="form-input" 
            name="shares" placeholder="Number of Shares"  onChange={
                (e) =>
                    setStockQty(e.target.value)
            } type="number">

            </input>
            <ErrorMsg value={stockQtyMsg}></ErrorMsg>
        </div>
        <button className="btn btn-primary" type="submit">Buy</button>

    </form>
    )
}
