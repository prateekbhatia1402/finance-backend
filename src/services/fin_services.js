import Axios from 'axios';

const API_ADDRESS = "http://localhost:8000/finance";

export const quote = function (sid, token) {
    const get_quote = async (stock_id, token) => {
        const finalResponse = ['err', '']
        try {
            const res = await Axios(
                {
                    method: 'GET',
                    url: API_ADDRESS + '/quote?sid=' + stock_id,
                    validateStatus: () => true,
                    headers: { 'x-auth-token': token }
                });
            if (res.status === 200) {
                finalResponse[0] = ''
                finalResponse[1] = res.data.data
                return finalResponse;
            }
            else if (res.status === 404) {
                return ["Invalid request", ""];
            }
            else {
                console.log(res.data.error)
                return [res.data.error, ""];
            }
        }
        catch (err) {
            console.log(err.message)
            return ["Something went wrong", ""]
        }
    }
    const value = get_quote(sid, token);
    return value;
}

export const buy = function (sid, qty, token) {
    const buy_shares = async (stockid, qty) => {
        const finalResponse = ['err', '']
        try {
            const res = await Axios(
                {
                    method: 'POST',
                    url: API_ADDRESS + '/buy',
                    data: {stockid, qty},
                    validateStatus: () => true,
                    headers: { 'x-auth-token': token }
                });
            if (res.status === 201) {
                finalResponse[0] = ''
                finalResponse[1] = res.data
                return finalResponse;
            }
            else if (res.status === 404) {
                return ["Invalid request", ""];
            }
            else {
                console.log(res.data.error)
                return [res.data.error, ""];
            }
        }
        catch (err) {
            console.log(err.message)
            return ["Something went wrong", ""]
        }
    }
    const value = buy_shares(sid, qty);
    return value;
}


export const sell = function (sid, qty, token) {
    const sell_shares = async (stockid, qty) => {
        const finalResponse = ['err', '']
        try {
            const res = await Axios(
                {
                    method: 'POST',
                    url: API_ADDRESS + '/sell',
                    data: {stockid, qty},
                    validateStatus: () => true,
                    headers: { 'x-auth-token': token }
                });
            if (res.status === 201) {
                finalResponse[0] = ''
                finalResponse[1] = res.data
                return finalResponse;
            }
            else if (res.status === 404) {
                return ["Invalid request", ""];
            }
            else {
                console.log(res.data.error)
                return [res.data.error, ""];
            }
        }
        catch (err) {
            console.log(err.message)
            return ["Something went wrong", ""]
        }
    }
    const value = sell_shares(sid, qty);
    return value;
}

export const quotes = function (sids, token) {
    const get_quotes = async (sids, token) => {
        try {
            const res = await Axios(
                {
                    method: 'GET',
                    url: API_ADDRESS + '/quotes?sids=' + JSON.stringify(sids),
                    validateStatus: () => true,
                    headers: { 'x-auth-token': token }
                });
            if (res.status === 200) {
                return res.data.data;
            }
            else if (res.status === 404) {
                return "Invalid request";
            }
            else {
                return res.data.error;
            }
        }
        catch (err) {
            console.log(err.message)
            return "Something went wrong"
        }
    }
    const value = get_quotes(sids, token);
    return value;
}


export const price_of_shares = function (sids, token) {
    const get_prices = async (sids, token) => {
        try {
            const price_data = await quotes(sids, token)
            if (!price_data)
                return null;
            if (price_data.length === 1)
                return price_data[0]['price']
            else {
                let res = {}
                for (let value of price_data) {
                    res[value['id']] = value['price']
                }
                return res;
            }
        }
        catch (err) {
            console.log(err)
            console.log('could not get price')
            return null
        }
    }
    const value = get_prices(sids, token);
    return value;
}