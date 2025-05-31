import React from 'react'
import './Footer.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SlSocialInstagram } from "react-icons/sl";
import { FaXTwitter, FaFacebook } from "react-icons/fa6";
import { FaYoutube, FaCcMastercard, FaCcVisa, FaCcPaypal } from "react-icons/fa";



export const Footer = () => {

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

    return (
        <motion.div 
            className='footer-wrapper'
            initial={{opacity:0}}
            whileInView={{opacity:1, duration:2}}    
        >
            <div className="container text-center">
                <div className="row">
                    <div className="footer col">
                        <h5>Hakkımızda</h5>
                        <ul class="list-group list-group-flush">
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link' to='/aboutus'>Biz Kimiz</Link></motion.li>
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link' to='career'>Kariyer</Link></motion.li>
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link' to='/contact'>İletişim</Link></motion.li>
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link' to='/createSeller'>Satış Yap</Link></motion.li>
                        </ul>
                    </div>
                    <div className="footer col">
                        <h5>Sosyal Medya</h5>
                        <ul class="list-group list-group-flush">
                            <motion.li class="list-item">
                                <div className='social-media-area'>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><SlSocialInstagram className='social-logo instagram' /></motion.div>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><FaXTwitter className='social-logo X' />   </motion.div>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><FaFacebook className='social-logo facebook' />   </motion.div>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><FaYoutube className='social-logo youtube' />   </motion.div>
                                </div>
                            </motion.li>
                            <h5 className='payment-header'>Ödeme Yöntemleri</h5>
                            <motion.li class="list-item">
                                <div className='social-media-area'>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><FaCcMastercard className='payment-logo mastercard' /></motion.div>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><FaCcVisa className='payment-logo visa' /></motion.div>
                                    <motion.div variants={listItemVariants} whileHover="hover" whileTap="tap"><FaCcPaypal className='payment-logo paypal' /></motion.div>
                                </div>
                            </motion.li>
                        </ul>
                    </div>
                    <div className="footer col">
                        <h5>Yardım</h5>
                        <ul class="list-group list-group-flush">
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link'>Sıkça Sorulan Sorular</Link></motion.li>
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link'>Canlı Yardım</Link></motion.li>
                            <motion.li variants={listItemVariants} whileHover="hover" whileTap="tap" class="list-item"><Link className='footer-li-link'>Nasıl İade Edebilirim</Link></motion.li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div >
    )
}
