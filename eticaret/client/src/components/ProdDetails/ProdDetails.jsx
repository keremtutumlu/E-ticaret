import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion'
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaStar } from 'react-icons/fa';
import './ProdDetails.css'
import { addCartStore } from '../../store/cart';
import { MdDelete } from "react-icons/md";

export const ProdDetails = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const objId = searchParams.get('pid');
    const isf = searchParams.get('isf') === 'true';
    const [isFavorited, setIsFavorited] = useState(isf);
    const [prod, setProd] = useState(null);
    const [favs, setFavs] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState([]);

    const handleDelComment = async (commentId) => {
        try {
            console.log(objId);
            console.log(commentId);

            const res = await fetch('http://localhost:3002/prod/delComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prodId: objId,
                    commentId: commentId
                })
            });

            const data = await res.json()

            if (res.status === 200) {
                toast.success(data.message);
                fetchProductComments();
                fetchProductDetails();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error('Yorum silinemedi!')
        }
    }

    const fetchProductComments = async () => {
        try {
            const res = await fetch('http://localhost:3002/prod/getCommentsWithUsernames', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prodId: objId })
            });

            if (res.status === 200) {
                const data = await res.json();
                setComments(data.comments);
            } else {
                const data = await res.json();
                toast.error(data.message);
                console.log(data.error);

            }
        } catch (error) {
            toast.error('Yorumlar alınırken bir hata oluştu.');
        }
    };

    const handleAddComment = async () => {
        if (user) {
            try {
                const res = await fetch('http://localhost:3002/user/addComment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user.email,
                        prodId: objId,
                        comment: newComment,
                        rate: rating
                    })
                });

                if (res.status === 200) {
                    toast.success('Yorum başarıyla eklendi!');
                    setNewComment('');
                    setRating(0);
                    fetchProductDetails();
                    fetchProductComments();
                } else {
                    const data = await res.json();
                    toast.error(data.message);
                    console.log(data.error);

                }
            } catch (error) {
                toast.error('Yorum eklenirken bir hata oluştu.');
            }
        } else {
            toast.error('Yorum yapabilmek için önce giriş yapınız!');
        }
    };

    const clickFav = async () => {
        if (user) {
            if (user.isAdmin) {
                toast.error('Admin kullanıcı favori işlemleri yapamaz!')
            } else {
                if (isFavorited) {
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
                        setIsFavorited(false)
                    } else {
                        const data = await res.json();
                        toast.error(data.message);
                    }
                } else {
                    const res = await fetch('http://localhost:3002/user/addFavorite', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: user.email,
                            prodId: objId
                        })
                    });

                    if (res.status === 200) {
                        toast.success('Ürün başarıyla favoriye eklendi!');
                        setIsFavorited(true);
                    } else {
                        const data = await res.json();
                        toast.error(data.message);
                    }
                }
            }
        } else {
            toast.error('Öncelikle kullanıcı girişi yapınız!')
        }
    }

    const handleCart = (objId) => {
        if(user.isAdmin){
            toast.error('Admin sepet işlemleri yapamaz!')
        }else{
            if (user) {
                dispatch(addCartStore(objId));
            } else {
                toast.error('Öncelikle kullanıcı girişi yapınız!');
            }
        }
    }

    const fetchProductDetails = async () => {
        try {
            const res = await fetch('http://localhost:3002/prod/getProdById', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ objId })
            });

            if (res.status === 200) {
                const data = await res.json();
                setProd(data.data);
            } else {
                const data = await res.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Ürün bilgisi alınırken bir hata oluştu.');
        }
    };

    useEffect(() => {
        fetchProductDetails();
        fetchProductComments();
    }, [objId]);

    return (
        <div className='container prod-details'>
            <div className="details-wrapper">
                <div className="row"><p className='cat-info-area'>{prod?.categories[0].name} --> {prod?.categories[0].subCategories[0].name}</p></div>
                <div className="row">
                    <div className="col">
                        {prod?.images?.length > 0 ? (
                            <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className='prod-img'
                                style={{ width: '100%', height: '25rem', objectFit: 'cover' }}
                            />
                        ) : (
                            <p>Ürün resmi mevcut değil.</p>
                        )}
                    </div>
                    <div className="col">
                        <pre><h2>{prod?.seller}</h2><p className='prod-name-p'>{prod?.name}</p></pre>
                        <div className="row">
                            <div className="col-8">
                                <hr />
                                <p className='prod-description'>{prod?.description}</p>
                            </div>
                            <div className="col"></div>
                        </div>
                        <p className='prod-detail-price-area'>{prod?.price} ₺</p>
                        <motion.button
                            className='add-cart-btn'
                            whileHover={{
                                scale: 1.03,
                                boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                            }}
                            whileTap={{
                                scale: 0.97
                            }}
                            onClick={(e) => handleCart(objId)}
                        >
                            <b>Sepete ekle</b>
                        </motion.button>
                        <motion.button
                            className='fav-icon-wrapper'
                            whileHover={{
                                scale: 1.01,
                                boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                            }}
                            whileTap={{
                                scale: 0.99
                            }}
                            onClick={(e) => clickFav()}
                        >
                            {isFavorited ? (
                                <MdFavorite className='prod-fav-icon' style={{ color: 'red' }} />
                            ) : (
                                <MdFavoriteBorder className='prod-fav-icon' style={{ color: 'grey' }} />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
            <div className="add-comment-section">
                {user && !user.isAdmin && (
                    <>
                        <hr />
                        <h3>Yorum Yap</h3>
                        <div className="row">
                            <div className="col-8">

                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder='Yorumunuzu yazın...'
                                    rows="2"
                                    cols="110"
                                />
                            </div>
                            <div className="col-2">
                                {/* Yıldız seçimi */}
                                <div className="star-rating">
                                    {[...Array(5)].map((star, index) => {
                                        const currentRating = index + 1;
                                        return (
                                            <FaStar
                                                key={index}
                                                size={24}
                                                onClick={() => setRating(currentRating)}
                                                color={currentRating <= rating ? "#ffc107" : "#e4e5e9"}
                                                style={{
                                                    marginRight: 10,
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        );
                                    })}
                                </div>

                                <p>Seçilen Puan: {rating}</p>
                            </div>
                            <div className="col-2">
                                <button className='btn btn-secondary' onClick={handleAddComment}>Yorum Yap</button>

                            </div>
                        </div>
                    </>
                )}
                <hr />
                
                <div className="display-comments-section">
                    <h3>Ürünün Yorumları</h3>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="comment-item">
                                {user.isAdmin && (
                                    <motion.button
                                        className='admin-com-del-btn'
                                        whileHover={{
                                            scale: 1.001,
                                            boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                                        }}
                                        whileTap={{
                                            scale: 0.999
                                        }}
                                        onClick={(e) => handleDelComment(comment._id)}
                                    >
                                        <MdDelete />
                                    </motion.button>
                                )}
                               
                                <h5>{comment.user || 'Anonim Kullanıcı'}</h5>
                                <div className="star-rating">
                                    {[...Array(5)].map((star, i) => (
                                        <FaStar
                                            key={i}
                                            size={16}
                                            color={i < comment.rate ? "#ffc107" : "#e4e5e9"}
                                        />
                                    ))}
                                </div>
                                <p>{comment.comment}</p>
                                <small>{new Date(comment.date).toLocaleDateString()}</small>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>Henüz yorum yapılmamış.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
