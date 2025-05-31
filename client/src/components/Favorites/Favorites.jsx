import React, { useEffect, useState } from 'react'
import './Favorites.css'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion'
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from "react-icons/io";

export const Favorites = () => {
    const user = useSelector((state) => state.auth.user);
    const [favProds, setFavProds] = useState([])
    const navigate = useNavigate()

    const renderStars = (average) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= average) {
                stars.push(<IoMdStar key={i} style={{ color: "rgb(255, 192, 0)" }} />);
            } else if (i - 0.5 <= average) {
                stars.push(<IoMdStarHalf key={i} />);
            } else {
                stars.push(<IoMdStarOutline key={i} />);
            }
        }
        return stars;
    }

    const getFavProds = async () => {

        const res = await fetch('http://localhost:3002/user/getFavProds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: user.email })
        });

        const data = await res.json()

        if (res.status === 200) {
            setFavProds(data.data);
        } else {
            toast.error(data.message);
        }

    }

    const handleFav = async (e, objId) => {
        e.stopPropagation()
        try {

            if (user) {
                const res = await fetch('http://localhost:3002/user/sellFavorite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user.email,
                        objId
                    })
                });

                if (res.status === 200) {
                    toast.success('Ürün başarıyla favorilerden kaldırıldı!');
                    setFavProds(favProds.filter(favProd => favProd._id !== objId));
                } else {
                    const data = await res.json();
                    toast.error(data.message);
                }
            }
        }
        catch (error) {
            toast.error('Favori eklemede bir hata oluştu!');
        }
    }

    const handleClickProd = (objId, isFavorited) => {
        try {
            navigate(`/prodDetails?pid=${objId}&&isf=${isFavorited}`);
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        getFavProds()
    }, [])

    return (
        <div className='container favorites'>
            <h4>Favori Ürünlerim</h4>
            <div className="row">
                {favProds.map((product) => {
                    const isFavorited = true;

                    return (
                        <div key={product.name} className="col-md-3">
                            <motion.div
                                className="card prod-items mb-2"
                                style={{ width: '14rem', height: '20rem' }}
                                whileHover={{
                                    scale: 1.001,
                                    boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                                }}
                                whileTap={{
                                    scale: 0.999
                                }}
                                onClick={(e) => handleClickProd(product._id, isFavorited)}
                            >
                                <img
                                    src={product.images[0]}
                                    className="card-img-top"
                                    alt={product.name}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <motion.button
                                    className='prod-fav-icon-wrapper'
                                    whileHover={{
                                        scale: 1.1,
                                    }}
                                    whileTap={{
                                        scale: 0.9
                                    }}
                                    onClick={(e) => handleFav(e, product._id)}>
                                    {isFavorited ? (
                                        <MdFavorite className='prod-fav-icon' style={{ color: 'red' }} />
                                    ) : (
                                        <MdFavoriteBorder className='prod-fav-icon' style={{ color: 'grey' }} />
                                    )}
                                </motion.button>
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">{product.ratings.average} {renderStars(product.ratings.average)} ({product.ratings.average})</p>
                                    <p className="card-text prod-price-area">{product.price}₺</p>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
