import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router';
import './Orders.css'

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [favs, setFavs] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate()

    const fetchFavs = async () => {
        try {
            const res = await fetch('http://localhost:3002/user/getFavProds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email
                })
            });

            const data = await res.json();
            if (data) {
                setFavs(data.data || []);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Favoriler getirilemedi!', error);
        }
    };

    const handleClickProd = (objId, isFavorited) => {
        try {
            navigate(`/prodDetails?pid=${objId}&&isf=${isFavorited}`);
        } catch (error) {
            toast.error(error)
        }
    }


    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:3002/user/getOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                }),
            });

            const data = await res.json();
            if (res.status === 200) {
                setOrders(data.data);
                const allProductIds = data.data.flatMap(order => order.prodId.map(item => item.prodId)); // Güncellenmiş isim
                fetchProducts(allProductIds);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Siparişler alınamadı');
        }
    };

    const fetchProducts = async (productIds) => {
        try {
            const res = await fetch('http://localhost:3002/prod/getProdsByIds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    objIds: productIds,
                }),
            });

            const data = await res.json();
            if (res.status === 200) {
                const productMap = data.data.reduce((acc, product) => {
                    acc[product._id] = product;
                    return acc;
                }, {});
                setProducts(productMap);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Ürünler alınamadı');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {

        if (user) {
            fetchFavs();
        }

    }, [user]);

    return (
        <div className='container orders'>
            <h3 className='orders-header'>Siparişlerim</h3>
            <hr />
            {orders.map((order) => (
                <div key={order._id} className='order-card'>
                    <h5>Sipariş ID: {order._id}</h5>
                    <p><small>Sipariş tarihi : {new Date(order.date).toLocaleDateString()}</small></p>
                    <div className="row">

                        {order.prodId.length > 0 ? (
                            order.prodId.map((item) => {
                                const product = products[item.prodId];
                                const isFavorited = favs.some(favProd => favProd._id === item.prodId);
                                return product ? (
                                    <motion.div
                                        key={item.prodId}
                                        className='product-card col-2'
                                        whileHover={{
                                            scale: 1.01,
                                            boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)',
                                            cursor: 'pointer'
                                        }}
                                        whileTap={{
                                            scale: 0.99
                                        }}
                                        onClick={(e) => handleClickProd(product._id, isFavorited)}
                                    >
                                        <h6>{product.name}</h6>
                                        <img src={product.images[0]} alt={product.name} style={{ width: '10rem', height: '10rem', objectFit: 'cover' }} />
                                        <p>Fiyat: {product.price} ₺</p>
                                    </motion.div>
                                ) : (
                                    <p key={item.prodId}>Yükleniyor...</p>
                                );
                            })
                        ) : (
                            <p>Ürün bilgisi bulunamadı.</p>
                        )}
                    </div>
                    <hr />
                </div>
            ))}
        </div>
    );
};
