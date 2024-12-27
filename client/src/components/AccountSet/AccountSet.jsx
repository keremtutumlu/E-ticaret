import React, { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import './AccountSet.css';
import { useSelector } from "react-redux";
import AddressForm from "./AddressForm";
import UserInfoForm from "./UserInfoForm";
import { FiCreditCard } from "react-icons/fi";
import toast from "react-hot-toast";
import AddCardForm from "./AddCardForm";


export const AccountSet = () => {
    const [selected, setSelected] = useState("userInfo");

    const cardAddHandle = () => {

    }

    const listItemVariants = {
        hover: {
            scale: 1.05,
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 200
            }
        },
        tap: {
            scale: 0.95,
            boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.03)',
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

    return (
        <>
            <h1 className="top-h1">Hesap Ayarları</h1>
            <LayoutGroup>
                <motion.div className='layout-group'>
                    <motion.div
                        layout
                        className="sidebar"
                        style={{ width: "20rem", padding: "10px" }}>
                        <ul className="option-list">
                            <motion.li
                                className="sidebar-item"
                                onClick={() => setSelected("userInfo")}
                                layoutId="userInfoItem"
                                initial={{ fontSize: selected === 'userInfo' ? "medium" : "x-large" }}
                                animate={{ fontSize: selected === 'userInfo' ? "x-large" : "medium" }}
                                whileHover="hover"
                                whileTap="tap"
                                variants={listItemVariants}
                                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            >
                                Kullanıcı Bilgileri
                            </motion.li>
                            <motion.li
                                className="sidebar-item"
                                onClick={() => setSelected("addCard")}
                                layoutId="addCardItem"
                                initial={{ fontSize: selected === 'addCard' ? "medium" : "x-large" }}
                                animate={{ fontSize: selected === 'addCard' ? "x-large" : "medium" }}
                                whileHover="hover"
                                whileTap="tap"
                                variants={listItemVariants}
                                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            >
                                Kart Ekle
                            </motion.li>
                            <motion.li
                                className="sidebar-item"
                                onClick={() => setSelected("addAddress")}
                                layoutId="addAddressItem"
                                initial={{ fontSize: selected === 'addAddress' ? "medium" : "x-large" }}
                                animate={{ fontSize: selected === 'addAddress' ? "x-large" : "medium" }}
                                whileHover="hover"
                                whileTap="tap"
                                variants={listItemVariants}
                                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            >
                                Adres Ekle
                            </motion.li>
                        </ul>
                    </motion.div>

                    <motion.div
                        layout
                        className="content"
                        style={{ marginLeft: "20px", padding: "20px", width: "30rem", height: "fit-content" }}
                        transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
                    >
                        {selected === "userInfo" && (
                            <UserInfoForm />
                        )}
                        {selected === "addCard" && (
                            <AddCardForm
                                onCardAdded={cardAddHandle}
                                onClose={() => cardAddHandle}
                            />
                        )}
                        {selected === "addAddress" && (
                            <motion.div
                                className="user-info-area"
                                layoutId="addAddressItem"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AddressForm />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </LayoutGroup>
        </>
    );
}
