import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import './Cart.css';
import { MdDelete } from "react-icons/md";
import { motion } from 'framer-motion';
import { removeCartStore } from '../../store/cart';
import PaymentModal from './PaymentModal';

export const Cart = () => {
    const cart = useSelector((state) => state.cart.cart);
    const dispatch = useDispatch();
    const [prods, setProds] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [campaign, setCampaign] = useState({});
    const [code, setCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        prods.map((prod) => {
            console.log(prod._id);
        })
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelCart = (objId) => {
        dispatch(removeCartStore(objId));
    };

    const handleCampaign = async () => {
        const seller = prods.map(comp => comp.seller);
        if (!seller || Object.keys(campaign).length > 0) {
            if (!seller) {
                toast.error('Satıcı bulunmuyor! Sepetinizi doldurunuz!');
            }
            else {
                toast.error('Birden fazla kupon kodu kullanılamaz!');
            }
        } else {
            const res = await fetch('http://localhost:3002/user/checkCampaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    seller,
                    code
                })
            });

            if (res.status === 200) {
                const data = await res.json();
                setCampaign(data.data);
                toast.success(`${data.data.code} kodlu ${data.data.seller} satıcısının %${data.data.percent} indirimli kuponu onaylandı!`);
            } else {
                toast.error('Kupon kodu doğrulanamadı');
            }

        }

    };

    const handleClearCampaign = () => {
        setCampaign({});
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await fetch('http://localhost:3002/prod/getProdsByIds', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ objIds: cart })
                });

                if (res.status === 200) {
                    const data = await res.json();
                    setProds(data.data);

                    const initialQuantities = {};
                    data.data.forEach(product => {
                        initialQuantities[product._id] = 1;
                    });
                    setQuantities(initialQuantities);
                } else {
                    const data = await res.json();
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error('Ürün bilgisi alınırken bir hata oluştu.');
            }
        };

        fetchProductDetails();
    }, [cart]);

    useEffect(() => {
        const calculateTotalPrice = () => {
            const total = prods.reduce((acc, product) => {
                const quantity = quantities[product._id] || 1;
                let productPrice = product.price * quantity;

                if (campaign.seller === product.seller) {
                    const discount = (campaign.percent / 100) * productPrice;
                    productPrice -= discount;
                }

                return acc + productPrice;
            }, 0);

            setTotalPrice(total);
        };

        calculateTotalPrice();
    }, [prods, quantities, campaign]);

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: newQuantity
        }));
    };

    return (
        <div className='container cart'>
            <div className="row">
                <h2 className='cart-header'>Sepetim</h2>
                <div className="col-8">
                    <hr />
                    {prods.length === 0 && (
                        <div>
                            <h5>Sepette ürün yok !</h5>
                        </div>
                    )}
                    {prods?.map((product) => (
                        <div className="card mb-3" key={product._id} style={{ maxWidth: '100%' }}>
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img src={product.images[0]} className="img-fluid rounded-start" alt="..." style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <p className="card-text">{product.description}</p>
                                        <p className="card-text"><small className="text-body-secondary seller-name-area">Satıcı : {product.seller}</small></p>
                                        <div className="prod-price">Fiyat : <b>{product.price} ₺</b></div>
                                    </div>
                                    
                                    <div className="quantity-area">
                                        <label htmlFor={`quantity-${product._id}`}>Adet : </label>
                                        <input
                                            id={`quantity-${product._id}`}
                                            type="number"
                                            min="1"
                                            value={quantities[product._id] || 1}
                                            onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value))}
                                            className="quantity-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            <motion.button
                                className='prod-del-btn'
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                                }}
                                whileTap={{
                                    scale: 0.95
                                }}
                                onClick={() => handleDelCart(product._id)}
                            >
                                <MdDelete className='prod-del-icon' />
                            </motion.button>
                        </div>
                    ))}
                </div>

                <div className="col-4 create-order-area">
                    <div className="container">
                        <div className="create-order-header">Sipariş Detayları</div>
                        <hr />
                        <p className='order-price-area'>Toplam Fiyat: <b>{totalPrice.toFixed(2)} ₺</b></p>
                        <div className="row campaign-code-area">
                            <p>Kupon Kodu :</p>
                            <input
                                className='form-control campaign-code-input'
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <button
                                className='btn btn-secondary campaign-code-button'
                                onClick={handleCampaign}
                            >
                                Kod Gir
                            </button>
                            {Object.keys(campaign).length > 0 && (
                                <div className='coupon-info-area'>
                                    %{campaign.percent} {campaign.seller} satıcısına ait kupon tanımlı. <br />
                                    <button
                                        className="del-coupon-btn"
                                        onClick={handleClearCampaign}
                                    >
                                        Kuponu kaldır <MdDelete />
                                    </button>
                                </div>
                            )}
                            <motion.button
                                className='btn accept-cart-btn'
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    border: 'none'
                                }}
                                onClick={openModal}
                            >
                                Sepeti Onayla
                            </motion.button>

                            <PaymentModal
                                isOpen={isModalOpen}
                                onRequestClose={closeModal}
                                totalPrice={totalPrice}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
