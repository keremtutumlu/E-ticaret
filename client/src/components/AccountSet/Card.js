import React, { useEffect, useState } from 'react'
import { FiCreditCard } from 'react-icons/fi';

const Card = ({ cardNo, CVV, ExpDate }) => {

    const [formattedNo, setFormattedNo] = useState(cardNo);

    useEffect(() => {
        let value = cardNo.replace(/\s+/g, '');
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        setFormattedNo(formattedValue);
    }, [cardNo])

    return (
        <div className='container card-wrapper'>
            <FiCreditCard className="card-siluet-icon" />
            <div className="card-preview">
                <div className="card-number-display">{formattedNo || "XXXX XXXX XXXX XXXX"}</div>
                <div className="card-info-display">
                    <div className="card-cvv-display">CVV: {CVV || "XXX"}</div>
                    <div className="card-expdate-display">EXP: {ExpDate || "XX/XX"}</div>
                </div>
            </div>
        </div>
    )
}

export default Card