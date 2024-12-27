import React, { useEffect, useState } from 'react';
import './Header.css';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CiUser } from "react-icons/ci";
import { MdOutlineKeyboardArrowDown, MdFavoriteBorder, MdOutlineShoppingCart } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { LuPanelLeftOpen } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { logoutStore, sellerLogoutStore } from '../../store/auth';
import toast from 'react-hot-toast';

export const Header = () => {
    const user = useSelector((state) => state.auth.user);
    const comp = useSelector((state) => state.auth.comp);
    const cart = useSelector((state) => state.cart.cart);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const handleCatSearch = async (catName) => {
        catName = catName.replace(/&/g, "%26");
        navigate(`/?cat=${catName}`);
    }

    const handleLogOut = async () => {
        dispatch(logoutStore());
        toast.success('Kullanıcı çıkışı yapılıyor...');
        navigate('/login?stat=true');
    };

    const handleSellerLogOut = async () => {
        dispatch(sellerLogoutStore());
        toast.success('Satıcı çıkışı yapılıyor...');
        navigate('/login?stat=true');
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const searchQuery = event.target.search.value.trim();
        if (searchQuery) {
            navigate(`/?search=${searchQuery}`);
        }
    };

    useEffect(() => {

    }, [user, comp]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3002/cat/getCat', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const result = await res.json();
                if (isMounted) {
                    setData(result.data || []);
                }
            } catch (error) {
                console.error('Veriler alınırken bir hata oluştu:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [])

    return (
        <div className='container-fluid bg-light'>
            <div className="container-fluid fixed-top">
                <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary top-navbar">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">trendyol</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
                                <li className="nav-item look">
                                    <Link className="nav-link disabled" aria-disabled="true">Göz atın...</Link>
                                </li>
                                <li className='search-li flex-grow-1'>
                                    <form className="d-flex" role="search" onSubmit={handleSearch}>
                                        <input name="search" className="form-control me-2" type="search" placeholder="Arama yap..." aria-label="Search" />
                                        <button className="btn btn-outline-secondary" type="submit">Ara</button>
                                    </form>
                                </li>

                                {!user && !comp && (
                                    <div className="login-wrapper">
                                        <Link className='fav-link' to="/login?stat=true">
                                            <CiLogin className='register-icon-header' />Giriş Yap
                                        </Link>
                                    </div>
                                )}
                                {(user || comp) && (
                                    <li className='dropdown-li'>
                                        <div className="dropdown">
                                            <Link className="dropdown-account" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <CiUser className='user-logo-header' />
                                                {user ? user.username : comp ? comp.compName : 'Hesabım'}
                                                <MdOutlineKeyboardArrowDown className='account-arrow' />
                                            </Link>
                                            <ul className="dropdown-menu dropdown-menu-dark">
                                                {user && (
                                                    <>
                                                        {user.isAdmin ? (
                                                            <>
                                                                <li><Link className="dropdown-item" to="/adminPanel">Admin Paneli</Link></li>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <li><Link className="dropdown-item" to="/accountSet">Hesap Ayarları</Link></li>
                                                                <li><Link className="dropdown-item" to="/orders">Siparişlerim</Link></li>
                                                            </>
                                                        )}
                                                        <li><button className="dropdown-item exit" onClick={handleLogOut}>Çıkış Yap</button></li>
                                                    </>
                                                )}

                                                {comp && (
                                                    <>
                                                        <li>
                                                            <Link className="dropdown-item" to={`/sellerHome?selNa=${comp.compName}`}>
                                                                Ana Sayfam
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="/seller-orders">Siparişler</Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to="/seller-products">Ürünlerim</Link>
                                                        </li>
                                                        <li>
                                                            <button className="dropdown-item exit" onClick={handleSellerLogOut}>
                                                                Çıkış Yap
                                                            </button>
                                                        </li>
                                                    </>
                                                )}

                                            </ul>
                                        </div>
                                    </li>
                                )}
                                <li className='fav-li'>
                                    {comp && (
                                        <>
                                            <div className="fav-wrapper">
                                                <Link className='fav-link' to="/sellerDashboard">
                                                    <LuPanelLeftOpen className='fav-icon-header' />Satıcı Paneli
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                    {user && !user.isAdmin && (
                                        <>
                                            <div className="fav-wrapper">
                                                <Link className='fav-link' to="/favorites">
                                                    <MdFavoriteBorder className='fav-icon-header' />Favorilerim
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                    {user && user.isAdmin && (
                                        <>
                                            <div className="fav-wrapper">
                                                <Link className='fav-link' to="/requests">
                                                    <MdFavoriteBorder className='fav-icon-header' />İstekler
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                    {!user && !comp && (
                                        <div className="fav-wrapper">
                                            <Link className='fav-link' to="/login?stat=false">
                                                <CiLogin className='register-icon-header' />Kaydol
                                            </Link>
                                        </div>
                                    )}

                                </li>
                                <li className='cart-li'>
                                    {user && !user.isAdmin && (
                                        <div className="cart-wrapper">

                                            <Link className='cart-link' to="/cart">
                                                <MdOutlineShoppingCart className='cart-icon-header' />Sepetim
                                            </Link>
                                            <span className="cart-badge badge rounded-pill bg-secondary">
                                                {cart.length}
                                                <span className="visually-hidden">Cart Items</span>
                                            </span>
                                        </div>
                                    )}

                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div className='header-split'></div>
            <div className="container mt-5">
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <nav class="navbar navbar-expand-lg bg-body-tertiary">
                            <div class="container-fluid">
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul class="navbar-nav">
                                        {Array.isArray(data) && data.map((cat, index) => (
                                            <li class="nav-item dropdown" key={index}>
                                                <Link class="nav-link dropdown-toggle" href="#" id={`navbarDropdown${index + 1}`} role="button" aria-expanded="false">
                                                    <b>{cat.name}</b>
                                                </Link>
                                                <div className="dropdown-menu bottom">
                                                    <div className="row">
                                                        <div className="col">
                                                            {Array.isArray(cat.subCats) && cat.subCats.map((subCat, subIndex) => (
                                                                <div className="col" key={subIndex}>
                                                                    <motion.p
                                                                        className='bottom-dropdown-subcats'
                                                                        whileHover={{
                                                                            scale: 1.05,
                                                                            boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
                                                                        }}
                                                                        whileTap={{
                                                                            scale: 0.95
                                                                        }}
                                                                        onClick={(e) => handleCatSearch(subCat.name)}
                                                                    >
                                                                        {subCat.name}
                                                                    </motion.p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </nav>


            </div>
            <div className='bottom-splitter'></div>
        </div>

    );
};
