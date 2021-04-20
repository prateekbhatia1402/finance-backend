import React, {useState, useContext} from 'react';
import TransactionsContext from '../context/TransactionsContext';
import UserContext from '../context/UserContext';
import { useHistory } from 'react-router-dom';
import {sell} from '../services/fin_services';
import ErrorMsg from './ErrorMsg';

export default function SellPage() {
    const history = useHistory();
    const { userData } = useContext(UserContext)
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
            setStockIdMsg('please select stock you want to sell')
        }
        else {
            setStockIdMsg('')
        }
        if (!stockQty || stockQty < 0) {
            check = false
            setStockQtyMsg('please enter number of shares you want to sell, it cannot be less than 1')
        }
        else {
            setStockQtyMsg('')
        }
        if (check) {
            if (stockQty > summaryData.shares[stockId]['qty'])
            {
                setFormMsg('You Don\'t own enough shares to sell ')
                return;   
            }
            setFormMsg('processing request... ')
            const sellRes = await sell(stockId, stockQty, userData.token)
            console.log(sellRes)
            setFormMsg(sellRes[0])
            if (sellRes[0] === '') {
                setFormMsg(sellRes[1]['msg'])
                const transaction = sellRes[1]['data']
                let transactions = transactionsData
                let summary = summaryData
                transactions['transactions'].push(transaction)
                transactions['cash'] += (transaction['price'] * transaction['qty'])
                setTransactionsData(transactions);
                summary['cash'] = transactions['cash']
                if (stockId in summary['shares']){
                    summary['shares'][stockId]['qty'] -= transaction.qty;
                    if (summary['shares'][stockId]['qty'] < 1){
                        delete summary['shares'][stockId];
                    }
                }
                setSummaryData(summary)
                history.push('/')
            }
        }
    }


    return (
    <form action="/sell" onSubmit={submit} method="post">
        <ErrorMsg value={formMsg}></ErrorMsg>
    <div className="form-group">
        
    <label htmlFor="sid"> Stock : </label>
    <select className="form-input" id="sid"  autoFocus 
                name="symbol" value={stockId}  onChange={
                (e) =>
                setStockId(e.target.value)
                }>
                    <option> -- </option>
                    {
                        Object.values(summaryData['shares']).map(share =>
                            <option key={share.id} value={share.id}>{share.name} ({share.id} {share.qty} stocks)</option>)
                    }
                    </select>
            <ErrorMsg value={stockIdMsg}></ErrorMsg>
    </div>
    <div className="form-group">

    <label htmlFor="qty"> Quantity : </label>
        <input autoComplete="off" id="qty" className="form-input" 
        name="shares" placeholder="Number of Shares"  onChange={
            (e) =>
                setStockQty(e.target.value)
        } type="number"></input>
        <ErrorMsg value={stockQtyMsg}></ErrorMsg>
    </div>
    <button className="btn btn-primary" type="submit">Sell</button>

</form>
    )
}
