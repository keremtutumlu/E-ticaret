import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import './Cart.css';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MdAddHome } from 'react-icons/md';
import { FiCreditCard } from 'react-icons/fi';
import AddressForm from '../AccountSet/AddressForm';
import AddCardForm from '../AccountSet/AddCardForm';
import { clearCartStore } from '../../store/cart';

Modal.setAppElement('#root');

const PaymentModal = ({ isOpen, onRequestClose, totalPrice }) => {
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedCard, setSelectedCard] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);
    const [addingAddress, setAddingAddress] = useState(false);
    const [addingCard, setAddingCard] = useState(false);
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart.cart);
    const user = useSelector((state) => state.auth.user);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('http://localhost:3002/user/getAdress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            if (res.status === 200) {
                setAddresses(data.data);
                setSelectedAddress(data.data[0]?._id || '');
            } else {
                setAddresses([]);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setAddresses([]);
        }
    };

    const fetchCards = async () => {
        try {
            const res = await fetch('http://localhost:3002/user/getCards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
            });
            const data = await res.json();
            if (res.status === 200) {
                setCards(data.data);
                setSelectedCard(data.data[0]?._id || '');
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            setCards([]);
        }
    };
    useEffect(() => {
        if (isOpen) {
            fetchAddresses();
            fetchCards();
        }
    }, [isOpen, user.email]);

    const handlePayment = async () => {
        if (!selectedAddress || !selectedCard) {
            toast.error('Lütfen bir adres ve kart seçin.');
            return;
        }

        const lastDigit = selectedCard[selectedCard.length - 1];
        
        if (lastDigit % 2 === 0) {

            const res = await fetch('http://localhost:3002/user/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    prodId: cart
                })
            });

            const data = await res.json()

            if(res.status === 200){
                toast.success(data.message);
                dispatch(clearCartStore())
                onRequestClose();
            }else{
                toast.error(data.message);
            }

        } else {
            toast.error('Ödeme alınamadı, lütfen geçerli bir kart numarası girin.');
        }
    };

    const handleAddCard = async () => {
        setAddingCard(!addingCard);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Ödeme Modalı"
            className="payment-modal"
            overlayClassName="payment-modal-overlay"
        >
            <h2>Ödeme Ekranı</h2>
            <p style={{fontSize:'larger'}}>Toplam Fiyat: <b>{totalPrice.toFixed(2)} ₺</b></p>

            <div className="payment-section">
                <h3>Kayıtlı Adresler</h3>
                {
                    addresses.length > 0 ? (
                        addresses.map((address) => (
                            <div key={address._id}>
                                <input
                                    type="radio"
                                    id={`address-${address._id}`}
                                    name="address"
                                    value={address._id}
                                    checked={selectedAddress === address._id}
                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                />
                                <label htmlFor={`address-${address._id}`}>
                                    Ülke: {address.country} Şehir: {address.city} İlçe: {address.district}
                                </label>
                            </div>
                        )
                        )
                    ) : (
                        <p>Kayıtlı adres bulunmuyor.</p>
                    )}
                <button onClick={() => setAddingAddress(!addingAddress)}>
                    Yeni Adres Ekle <MdAddHome />
                </button>
            </div>

            <div className="payment-section">
                <h3>Kayıtlı Kartlar</h3>
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div key={card._id}>
                            <input
                                type="radio"
                                id={`card-${card._id}`}
                                name="card"
                                value={card.cardNo}
                                checked={selectedCard === card.cardNo}
                                onChange={(e) => setSelectedCard(e.target.value)}
                            />
                            <label htmlFor={`card-${card._id}`}>
                                **** **** **** {card.cardNo.slice(-4)}
                            </label>
                        </div>
                    ))
                ) : (
                    <p>Kayıtlı kart bulunmuyor.</p>
                )}
                <button onClick={handleAddCard}>
                    Yeni Kart Ekle <FiCreditCard />
                </button>
            </div>

            {addingAddress && (
                <AddressForm
                    onClose={() => setAddingAddress(false)}
                    onAddressAdded={fetchAddresses}
                />
            )}

            {addingCard && (
                <AddCardForm
                    onClose={() => setAddingCard(false)}
                    onCardAdded={fetchCards}
                />
            )}

            <button className="btn btn-success btn-m mt-4 w-100" onClick={handlePayment}>Ödeme Yap</button>
        </Modal>
    );
};

export default PaymentModal;
