import React, { useState, useEffect } from 'react';
import './SellerDashboard.css';
import toast from 'react-hot-toast';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion'

export const SellerDashboard = () => {
  const comp = useSelector((state) => state.auth.comp);
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [variantName, setVariantName] = useState('');
  const [variantOptions, setVariantOptions] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    variants: [],
    images: []
  });
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [campaigns, setCampaigns] = useState([]);

  const generateCouponCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCouponCode(randomCode);
  };

  const handleCampaignDel = async (code) => {
    const res = await fetch('http://localhost:3002/seller/delCampaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code
      })
    });

    if(res.status === 200){
      setCampaigns(campaigns.filter(campaign => campaign.code !== code))
      toast.success(`${code} no'lu kupon kodu başarıyla kaldırıldı!`)
    }else{
      const data = await res.json();
      toast.error(data.message)
    }

  }

  const handleGenereteCoupon = async () => {

    const res = await fetch('http://localhost:3002/seller/createCampaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: couponCode,
        seller: comp.compName,
        percent: discountPercentage
      })
    });

    if (res.status === 200) {
      toast.success(`${couponCode} kodlu %${discountPercentage} oranlı kupon kodu başarıyla tanımlandı!`);
      const data = await res.json();
      setCampaigns([...campaigns, data.data]);
    } else {
      const data = await res.json()
      toast.error(data.message)
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3002/cat/getCat');
        const data = await res.json();
        setCategories(data.data);
      } catch (error) {
        toast.error('Kategoriler yüklenirken bir hata oluştu.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch('http://localhost:3002/seller/getCampaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            seller: await comp.compName
          })
        });

        if (res.status === 200) {
          const data = await res.json();
          setCampaigns(await data.data);
          console.log(campaigns);

        }

      } catch (error) {
        toast.error('Kupon getirme hatası!');
      }
    }

    fetchCampaigns()
  }, [comp])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (productName) => {
    if (!selectedFile) {
      toast.error('Lütfen bir dosya seçin.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('folder', `/prods/${comp.compName}`);
    formData.append('fileName', `/${productName}`);

    try {
      const res = await fetch('http://localhost:3002/img/uploadImg', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.status === 200) {
        toast.success(`Resim başarıyla yüklendi: ${data.public_id}`);

        const imageUrl = `https://res.cloudinary.com/dbofmdmkp/image/upload/prods/${comp.compName}/${data.public_id}.jpg`;
        return imageUrl;
      } else {
        toast.error(data.message || 'Resim yüklerken bir hata oluştu!');
        return null;
      }
    } catch (error) {
      toast.error(error.message || 'Bir hata oluştu');
      return null;
    }
  };

  const handleAddVariant = () => {
    if (variantName && variantOptions.length > 0) {
      setProductDetails({
        ...productDetails,
        variants: [...productDetails.variants, { name: variantName, options: variantOptions }]
      });
      setVariantName('');
      setVariantOptions([]);
    } else {
      toast.error('Varyant adı ve opsiyonları eksik!');
    }
  };

  const handleAddOption = () => {
    const newOption = {
      option: '',
      stock: 0
    };

    setVariantOptions([...variantOptions, newOption]);
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...variantOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setVariantOptions(newOptions);
  };

  const handleProductChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    const seller = comp.compName
    const { name, description, price, variants } = productDetails;

    if (!name || !description || !price || !selectedCategory || !variants.length || !selectedSubCategory) {
      toast.error('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    if (!seller) {
      console.log(seller);

      toast.error('Satıcı girişi yapılmamış!');
      return;
    }

    const res = await fetch('http://localhost:3002/prod/createProd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description,
        price,
        categories: [{ name: selectedCategory, subCategories: [{ name: selectedSubCategory }] }],
        variants,
        seller
      })
    });

    if (res.status === 200) {
      const imgUrl = await handleUpload(name);

      if (imgUrl) {
        toast.success(`${name} adlı ürün başarıyla eklendi!`);
      }
      else {
        toast.error('Görsel ekleme hatası! Ürün görselsiz oluşturuldu!')
      }
    } else {
      const data = await res.json()
      toast.error(data.message)
    }

  };

  return (
    <div className="container seller-dash">
      <div className='container seller-dash-navigate-wrapper'>
        <motion.a
          href="#addProd"
          className='dash-side-nav-item'
          whileHover={{
            scale: 1.03,
            boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
          }}
          whileTap={{
            scale: 0.97
          }}
        >Ürün Ekleme</motion.a>
        <motion.a
          href="#createCampaign"
          className='dash-side-nav-item'
          whileHover={{
            scale: 1.03,
            boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
          }}
          whileTap={{
            scale: 0.97
          }}
        >Kupon Kodu Oluşturma</motion.a>
        <motion.a
          href="#displayCampaign"
          className='dash-side-nav-item'
          whileHover={{
            scale: 1.03,
            boxShadow: '2px 1px 5px 5px rgba(0, 0, 0, 0.05)'
          }}
          whileTap={{
            scale: 0.97
          }}
        >Kampanyaları Görüntüle</motion.a>
      </div>
      <h4 id='addProd'>Ürün Ekle</h4>
      <hr />
      
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Ürün Adı"
          className="form-control"
          onChange={handleProductChange}
        />
        <textarea
          name="description"
          placeholder="Ürün Açıklaması"
          className="form-control mt-2"
          onChange={handleProductChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Ürün Fiyatı"
          className="form-control mt-2"
          onChange={handleProductChange}
        />

        <input
          type="text"
          value={variantName}
          placeholder="Varyant Türü (örn. Renk)"
          className="form-control mt-2"
          onChange={(e) => setVariantName(e.target.value)}
        />

        {variantOptions.map((option, index) => (
          <div className="mt-2" key={index}>
            <input
              type="text"
              placeholder="Opsiyon"
              className="form-control mt-2"
              value={option.option}
              onChange={(e) => handleOptionChange(index, 'option', e.target.value)}
            />
            <input
              type="number"
              placeholder="Stok"
              className="form-control mt-2"
              value={option.stock}
              onChange={(e) => handleOptionChange(index, 'stock', e.target.value)}
            />
          </div>
        ))}

        <button className="btn btn-secondary mt-2" onClick={handleAddOption}>
          Opsiyon Ekle
        </button>

        <button className="btn btn-secondary mt-2" onClick={handleAddVariant}>
          Varyantı Oluştur
        </button>

        <div className="mt-2">
          {productDetails.variants.map((variant, index) => (
            <div key={index}>
              <h5>{variant.name}</h5>
              {variant.options.map((opt, i) => (
                <div key={i}>
                  <span>{opt.option} - Stok: {opt.stock}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <select
          className="form-select mt-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Kategori Seçin</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {selectedCategory && (
          <select
            className="form-select mt-2"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="">Alt Kategori Seçin</option>
            {categories
              .find((cat) => cat.name === selectedCategory)
              ?.subCats.map((subCat) => (
                <option key={subCat._id} value={subCat.name}>
                  {subCat.name}
                </option>
              ))}
          </select>
        )}

        <input className="form-control mt-2" type="file" onChange={handleFileChange} />

      </div>

      <button className="btn btn-success mt-3" onClick={handleAddProduct}>
        Ürünü Oluştur
      </button>


      <h4 className='mt-5' id='createCampaign'>Kupon Kodu Oluştur</h4>
      <hr />

      <div className="mb-3">
        <label htmlFor="couponCode" className="form-label">Kupon Kodu</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            id="couponCode"
            value={couponCode}
            readOnly
            required
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={generateCouponCode}
          >
            Oluştur
          </button>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="discountPercentage" className="form-label">İndirim Yüzdesi</label>
        <input
          type="number"
          className="form-control"
          id="discountPercentage"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          placeholder="İndirim Yüzdesi Girin"
          min="0"
          max="100"
          required
        />
      </div>
      <button className="btn btn-primary" onClick={handleGenereteCoupon}>
        Kuponu Kaydet
      </button>

      <h4 className='mt-5' id='displayCampaign'>Kuponları Görüntüle</h4>
      <hr />
      <div className="mb-3">
        <div className="row">
          {campaigns.map((campaign, index) => (

            <div className="col-6 campaign-card" key={campaigns._id}>
              <div className='row'>
                <div className="col-6">
                  <pre>
                    Kupon Kodu : {campaign.code}     Yüzdesi : %{campaign.percent}
                  </pre>
                </div>
                <div className="col">
                  <motion.button
                    className='del-campaign-button'
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.97
                    }}
                    onClick={(e) => handleCampaignDel(campaign.code)}
                  >
                    <MdDelete className='del-campaign-icon' />
                  </motion.button>
                </div>
                <div className="col-2"></div>
              </div>
            </div>

          ))}
        </div>
      </div>

    </div>
  );
};
