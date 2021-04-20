import React, { useState, useContext } from 'react';
// import Axios from 'axios';
import ErrorMsg from './ErrorMsg'
import UserContext from '../context/UserContext';
import '../App.css';
import { quote } from '../services/fin_services';

export default function QuotePage() {
    const [priceData, setPriceData] = useState({ 'price': "", name: "" })
    const { userData } = useContext(UserContext)
    const [sid, setSid] = useState("")
    const [status, setStatus] = useState("")

    const getCurrentPrice = async function () {
        try {
            if (!sid || sid.trim() === '') {
                setStatus('Stock ID cannot be left blank')
                return
            }/* 
            const res = Axios.get(API_ADDRESS + '/quote?sid=' + sid,
                { headers: { 'x-auth-token': userData.token } }); */
            setStatus('getting data... ')
            const res = await quote(sid, userData.token);
            setStatus(res[0])
            if (res[0] === '')
                setPriceData(res[1])
        }
        catch (err) {
            setStatus(err.message)
            console.log(err)
        }
    }
    return (
        <>
            <br></br>
            <form className="form-group">
                <label htmlFor="sid"> Stock ID</label>
                <input type="text" className="form-input" name="sid" id="sid"
                    placeholder="NASDAQ SOTCK ID" onChange={
                        (e) =>
                            setSid(e.target.value)
                    }></input>
            </form>
            <ErrorMsg value={status}></ErrorMsg>
            <button type="button" className="btn btn-primary" onClick={getCurrentPrice}>GET Price</button>
            <br></br>
            <h3>{priceData['name']}</h3>
            <div >{priceData['price']}</div>
        </>
    )
}
