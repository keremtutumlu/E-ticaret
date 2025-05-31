import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FiCreditCard } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './AccountSet.css';
import Card from './Card';

const AddCardForm = ({ onClose, onCardAdded }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [expDate, setExpDate] = useState('');
    const user = useSelector((state) => state.auth.user);

    const handleCvvInput = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3);
        setCvv(value);
    };

    const handleExpDateInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        if (value.length > 5) {
            value = value.slice(0, 5);
        }
        setExpDate(value);
    };

    const handleAddCreditCard = async () => {
        const formattedCardNumber = cardNumber.replace(/\s+/g, '');

        if (formattedCardNumber.length === 16 && cvv.length === 3 && expDate.length === 5) {
            const newCard = {
                cardNo: formattedCardNumber,
                CVV: cvv,
                expDate: expDate
            };

            const res = await fetch('http://localhost:3002/user/addCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    card: newCard
                })
            });

            const data = await res.json();

            if (res.status === 200) {
                toast.success(data.message);
                onCardAdded();
                onClose();
            } else {
                toast.error(data.message);
            }

        } else {
            toast.error('Lütfen geçerli kart giriniz!');
        }
    };

    return (
        <motion.div
            layoutId="addCardItem"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='container add-card'
        >
            <h2>Kart Ekle</h2>
            <hr />
            <Card 
                cardNo={cardNumber}
                CVV={cvv}
                ExpDate={expDate}
            />
            <div className="card-input-area">
                <div>
                    <label>Kart Numarası:</label>
                    <input
                        type="text"
                        id="credit-card-input"
                        className='credit-card-input'
                        maxLength="19"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardNumber}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\s+/g, '');
                            if (value.length > 16) {
                                value = value.slice(0, 16);
                            }
                            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                            setCardNumber(formattedValue);
                            e.target.value = formattedValue;
                        }}
                    />
                </div>
                <div>
                    <label className="cvv-label">CVV : </label>
                    <input
                        type="text"
                        className='credit-card-cvv-input'
                        maxLength="3"
                        placeholder="XXX"
                        value={cvv}
                        onChange={handleCvvInput}
                    />
                    <label className="expdate-label">Son Kullanma Tarihi : </label>
                    <input
                        type="text"
                        className='credit-card-expdate-input'
                        maxLength="5"
                        placeholder="XX/XX"
                        value={expDate}
                        onChange={handleExpDateInput}
                    />
                </div>
                <button className="btn btn-secondary btn-m mt-2" onClick={handleAddCreditCard}>Ekle</button>
            </div>
        </motion.div>
    );
};

export default AddCardForm;
