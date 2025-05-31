import React, { useEffect, useState } from 'react'
import './Home.css'
import { motion } from 'framer-motion'
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from "react-icons/io";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const PRODUCTS_PER_PAGE = 16;

export const Home = () => {

  const user = useSelector((state) => state.auth.user);
  const comp = useSelector((state) => state.auth.comp);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [favs, setFavs] = useState([]);
  const [fMinPrice, setFMinPrice] = useState(0);
  const [fMaxPrice, setFMaxPrice] = useState(1000000);
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || '';
  let catQuery = searchParams.get('cat') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchedProds, setSearchedProds] = useState([]);
  const [priceSortOrder, setPriceSortOrder] = useState('desc');
  const [likeSortOrder, setLikeSortOrder] = useState('desc');

  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = searchedProds.slice(indexOfFirstProduct, indexOfLastProduct);

  /*FILTER PROCESSES START*/

  useEffect(() => {
    let sortedProducts = [...products];

    // Ürünleri sıralama seçeneğine göre sıralayın
    sortedProducts.sort((a, b) => likeSortOrder === 'desc' ? b.likes - a.likes : a.likes - b.likes);
    sortedProducts.sort((a, b) => priceSortOrder === 'desc' ? b.price - a.price : a.price - b.price);

    // İlk olarak ürünleri filtreleyin
    const filtered = sortedProducts.filter(product => {
      return (
        product.price >= fMinPrice &&
        product.price <= fMaxPrice
      );
    });

    // Arama sorgusuna göre daraltın
    const searchFiltered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchedProds(searchFiltered);
  }, [likeSortOrder, priceSortOrder, fMinPrice, fMaxPrice, searchQuery, products]);

  /*FILTER PROCESSES END*/

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

  const handleDel = async (e, objId) => {
    e.stopPropagation()
    try {
      if (user.isAdmin) {
        const res = await fetch('http://localhost:3002/prod/delProd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ objId: objId })
        });

        const data = await res.json();

        if (res.status === 200) {
          toast.success(data.message);
          products.filter((prod) => prod._id !== objId);
        } else {
          toast.error(data.message);
        }

      } else {
        toast.error('Hata Admin Değilsiniz!')
      }
    } catch (error) {
      toast.error('Anaa : ', error)
    }
  }

  const handleClickProd = (objId, isFavorited) => {
    try {
      navigate(`/prodDetails?pid=${objId}&&isf=${isFavorited}`);
    } catch (error) {
      toast.error(error)
    }
  }

  const handleFav = async (e, objId) => {
    e.stopPropagation()
    try {

      if (user) {
        const isFavorited = favs.some(favProd => favProd._id === objId);
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
            setFavs(favs.filter(favProd => favProd._id !== objId));
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
            fetchFavs()
          } else {
            const data = await res.json();
            toast.error(data.message);
          }
        }
      } else {
        toast.error('Favoriye eklemek için giriş yapınız!');
      }
    } catch (error) {
      toast.error('Favori eklemede bir hata oluştu!');
    }
  }

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

  useEffect(() => {
    if (catQuery === '') {
      const fetchProducts = async () => {
        try {
          const res = await fetch('http://localhost:3002/prod/getProd', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });

          const data = await res.json();
          setProducts(data.data || []);

        } catch (error) {
          console.error('Ürünler çekilirken hata oluştu:', error);
        }
      };

      fetchProducts();
    } else {
      const fetchProducts = async () => {
        try {
          const res = await fetch('http://localhost:3002/prod/getProdByCat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cat: catQuery })
          });

          const data = await res.json();
          setProducts(data.data || []);

        } catch (error) {
          console.error('Ürünler çekilirken hata oluştu:', error);
        }
      };

      fetchProducts();
    }

  }, []);

  useEffect(() => {
    console.log(catQuery);

    if (catQuery === '') {
      const fetchProducts = async () => {
        try {
          const res = await fetch('http://localhost:3002/prod/getProd', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });

          const data = await res.json();
          setProducts(data.data || []);

        } catch (error) {
          console.error('Ürünler çekilirken hata oluştu:', error);
        }
      };

      fetchProducts();
    } else {
      const fetchProducts = async () => {
        try {
          const res = await fetch('http://localhost:3002/prod/getProdByCat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cat: catQuery })
          });

          const data = await res.json();
          setProducts(data.data || []);

        } catch (error) {
          console.error('Ürünler çekilirken hata oluştu:', error);
        }
      };

      fetchProducts();
    }

  }, [catQuery]);

  useEffect(() => {

    if (user) {
      fetchFavs();
    }

  }, [user]);

  return (
    <motion.div
      className="container home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h4 className='header-top'>Tüm Ürünler</h4>

      <div className="filter-sidebar fixed-left">
        <h5>Filtreler</h5>
        <div>
          <label htmlFor="minPrice">Min Fiyat:</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            value={fMinPrice}
            onChange={(e) => setFMinPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="maxPrice">Max Fiyat:</label>
          <input
            type="number"
            id="maxPrice"
            name="maxPrice"
            value={fMaxPrice}
            onChange={(e) => setFMaxPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="sortByLikes">Sıralama(Beğeni):</label>
          <select id="sortByLikes" name="sortByLikes" value={likeSortOrder} onChange={(e) => setLikeSortOrder(e.target.value)}>
            <option value="likes-desc">Beğeni Sayısı (Azalan)</option>
            <option value="likes-asc">Beğeni Sayısı (Artan)</option>
          </select>
        </div>
        <div>
          <label htmlFor='sortByPrice'>Sıralama(Fiyat) :</label>
          <select id="sortByPrice" name="sortByPrice" value={priceSortOrder} onChange={(e) => setPriceSortOrder(e.target.value)}>
            <option value="desc">Fiyata Göre (Azalan)</option>
            <option value="asc">Fiyata Göre (Artan)</option>
          </select>
        </div>
      </div>


      <div className="row prod-row">
        {searchedProds.length == 0 && (
          <h5>Aradığınız ürün bulunamadı!</h5>
        )}
        {currentProducts.map((product) => {
          const isFavorited = favs.some(favProd => favProd._id === product._id);

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

                {user?.isAdmin ?
                  (
                    <>
                      <motion.button
                        className='prod-fav-icon-wrapper'
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{
                          scale: 0.9
                        }}
                        onClick={(e) => handleDel(e, product._id)}
                      >
                        <MdDelete className='prod-fav-icon' />
                      </motion.button>
                    </>
                  )
                  :
                  (
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
                  )

                }

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
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Önceki
        </button>
        <span>Sayfa {currentPage}</span>
        <button onClick={() => setCurrentPage(prev => (indexOfLastProduct < filteredProducts.length ? prev + 1 : prev))} disabled={indexOfLastProduct >= filteredProducts.length}>
          Sonraki
        </button>
      </div>
    </motion.div >
  )
}
