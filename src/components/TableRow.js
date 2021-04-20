import React from 'react'

import './Transactions.css';

export default function TableRow(props) {
    let value = props.value
    let classes = props.className
    console.log('row value :: ', value)
    return (
        <tr className={classes}>
            {
                value.map((value, index) => {
                    return <td key={index}>{value}</td>
                })
            }
        </tr>
    )
}
