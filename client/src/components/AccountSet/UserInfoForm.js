import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { FaPen, FaSave } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Card from "./Card";
import toast from "react-hot-toast";


const UserInfoForm = () => {

    const user = useSelector((state) => state.auth.user);
    const [inputs, setInputs] = useState({
        username: { value: user.username, isDisabled: true },
        email: { value: user.email, isDisabled: true },
        password: { value: '************', isDisabled: true }
    });
    const [addresses, setAddresses] = useState([]);
    const [cards, setCards] = useState([]);

    const handleEdit = (inputName) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            [inputName]: { ...prevInputs[inputName], isDisabled: false },
        }));
    };

    const handleAddressDel = async (objId) => {
        try {
            const res = await fetch('http://localhost:3002/user/delAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    objId
                })
            });

            const data = await res.json();

            if (res.status === 200) {
                toast.success(data.message)
                fetchAddresses();
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error('Adres silme hatası!');
        }
    }

    const handleCardDel = async (objId) => {
        try {
            const res = await fetch('http://localhost:3002/user/delCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email,
                    objId
                })
            });

            const data = await res.json();

            if (res.status === 200) {
                toast.success(data.message)
                fetchCards();
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error('Kart silme hatası!');
        }
    }

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
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
            setCards([]);
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.3)',
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 200
            }
        },
        tap: {
            scale: 0.95,
            boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.35)',
        }
    };

    useEffect(() => {
        if (user) {
            fetchAddresses();
            fetchCards();
        }
    }, []);

    return (
        <motion.div
            className="user-info-area"
            layoutId="userInfoItem"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2>Kullanıcı Bilgileri</h2>
            <hr />
            <div className="input-group mb-3 user-info">
                <span className="input-group-text user-info" id="basic-addon1">Kullanıcı Adı</span>
                <input
                    type="text"
                    className="form-control"
                    value={inputs.username.value}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    disabled={inputs.username.isDisabled}
                    onChange={(e) => setInputs((prevInputs) => ({
                        ...prevInputs,
                        username: { ...prevInputs.username, value: e.target.value },
                    }))}
                />
                <FaPen
                    className="user-info-set-icon"
                    onClick={() => handleEdit('username')}
                />
            </div>
            <div className="input-group mb-3 user-info">
                <span className="input-group-text user-info" id="basic-addon1">E-mail</span>
                <input
                    type="text"
                    className="form-control"
                    value={inputs.email.value}
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    disabled={inputs.email.isDisabled}
                    onChange={(e) => setInputs((prevInputs) => ({
                        ...prevInputs,
                        email: { ...prevInputs.email, value: e.target.value },
                    }))}
                />
                <FaPen
                    className="user-info-set-icon"
                    onClick={() => handleEdit('email')}
                />
            </div>
            <div className="input-group mb-3 user-info">
                <span className="input-group-text user-info" id="basic-addon1">Parola</span>
                <input
                    type="text"
                    className="form-control"
                    value={inputs.password.value}
                    aria-label="Password"
                    aria-describedby="basic-addon1"
                    disabled={inputs.password.isDisabled}
                    onChange={(e) => setInputs((prevInputs) => ({
                        ...prevInputs,
                        password: { ...prevInputs.password, value: e.target.value },
                    }))}
                />
                <FaPen
                    className="user-info-set-icon"
                    onClick={() => handleEdit('password')}
                />
            </div>
            <div className="user-info-buttons">
                <motion.button
                    className="user-info-save"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                >
                    Kaydet <FaSave className="user-info-save-icon" />
                </motion.button>
                <motion.button
                    className="user-info-cancel"
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                >
                    İptal <MdCancel className="user-info-cancel-icon" />
                </motion.button>
            </div>
            <h2 className="cards-info-header mt-4">Kartlarım</h2>
            <hr />
            {cards.length === 0 && (<h5>Kayıtlı kart yok!</h5>)}
            {cards.map((card) => (
                <div className="card-info-display" key={card._id}>
                    <Card
                        cardNo={card.cardNo}
                        CVV={card.CVV}
                        ExpDate={card.expDate}
                    />

                    <motion.button
                        className="card-del-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={(e) => handleCardDel(card._id)}
                    >
                        <MdCancel className="card-del-icon" />
                    </motion.button>
                </div>
            ))}

            <h2>Adreslerim</h2>
            <hr />
            {addresses.length === 0 && (<h5>Kayıtlı adres yok!</h5>)}
            {addresses.map((address) => (
                <motion.div
                    className="address-card mb-4"
                    whileHover={{
                        scale: 1.001,
                        boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                    }}
                    whileTap={{
                        scale: 0.999
                    }}
                >
                    <p>Ülke : {address.country} Şehir : {address.city} İlçe : {address.district}</p>
                    <motion.button
                        className="address-del-btn"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={(e) => handleAddressDel(address._id)}
                    >
                        <MdCancel className="address-del-icon" />
                    </motion.button>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default UserInfoForm