import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import './SellerRegister.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export const SellerRegister = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  const token = searchParams.get('info')
  const [compName, setName] = useState('');
  const [compEmail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch('http://localhost:3002/seller/registerSeller', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        compName,
        compEmail,
        password,
        selectedCity,
        selectedCountry,
        selectedDistrict
      })
    });

    const data = await res.json();

    if(data.comp){
      toast.success(data.message);
      navigate('/')
    }
    else{
      toast.error(data.message)
    }
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3002/address/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.get(`http://localhost:3002/address/cities?countryCode=${selectedCountry}`);
          setCities(response.data);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    };

    fetchCities();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedCity) {
        try {
          const response = await axios.get(`http://localhost:3002/address/districts?countryCode=${selectedCountry}&stateCode=${selectedCity}`);
          setDistricts(response.data);
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };

    fetchDistricts();
  }, [selectedCity]);

  useEffect(() => {
    const decodeToken = async () => {
      try {
        const res = await fetch('http://localhost:3002/token/decodeToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token
          })
        });

        const data = await res.json();

        setName(data.data.compName);
        setEmail(data.data.compEmail);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    decodeToken();
  }, [token]);

  return (
    <motion.div
      className='container seller-register-wrapper'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form className='seller-register-form' onSubmit={handleSubmit}>
        <motion.h4
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Şirket Kaydı
        </motion.h4>
        <hr />
        <motion.div
          class="mb-3 row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <label for="staticName" class="col-sm-2 col-form-label">Şirketinizin Adı</label>
          <div class="col-sm-10">
            <input type="text" readonly class="form-control-plaintext" id="staticName" value={compName} />
          </div>
        </motion.div>
        <motion.div
          class="mb-3 row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <label for="staticEmail" class="col-sm-2 col-form-label">Şirketinizin E-maili</label>
          <div class="col-sm-10">
            <input type="text" readonly class="form-control-plaintext" id="staticEmail" value={compEmail} />
          </div>
        </motion.div>
        <motion.div
          class="mb-3 row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5 }}
        >
          <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
          <div class="col-sm-10">
            <input type="password" class="form-control" id="inputPassword" onChange={e => setPassword(e.target.value)} value={password}/>
          </div>
        </motion.div>
        <motion.h6
          className='address-header'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.8 }}
        >
          Şirket Adres Bilgileri
        </motion.h6>
        <motion.select
          className='form-select addAddress'
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        >
          <option value="">Ülke Seçiniz</option>
          {countries.map(country => (
            <option key={country.iso2} value={country.iso2}>{country.name}</option>
          ))}
        </motion.select>
        <motion.select
          className='form-select addAddress'
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          disabled={!selectedCountry}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3.5 }}
        >
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.iso2} value={city.iso2}>{city.name}</option>
          ))}
        </motion.select>
        <motion.select
          className='form-select addAddress'
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          disabled={!selectedCity}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
        >
          <option value="">Select District</option>
          {districts.map(district => (
            <option key={district.iso2} value={district.iso2}>{district.name}</option>
          ))}
        </motion.select>
        <motion.button
          type="submit"
          className="btn btn-secondary btn-m"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4.5 }}
        >
          Kaydı oluştur
        </motion.button>
      </form>
    </motion.div>
  )
}
