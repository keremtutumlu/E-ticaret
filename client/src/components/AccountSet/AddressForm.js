import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MdAddHome } from "react-icons/md";
import './AccountSet.css';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const AddressForm = ({ onAddressAdded, onClose }) => {

  const user = useSelector((state) => state.auth.user);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const [address, setAddress] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3002/address/countries')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios.get(`http://localhost:3002/address/cities?countryCode=${selectedCountry}`)
        .then(response => setCities(response.data))
        .catch(error => console.error('Error fetching cities:', error));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCity) {
      axios.get(`http://localhost:3002/address/districts?countryCode=${selectedCountry}&stateCode=${selectedCity}`)
        .then(response => setDistricts(response.data))
        .catch(error => console.error('Error fetching districts:', error));
    }
  }, [selectedCity]);

  const handleSubmit = async () => {
    if (!selectedCountry || !selectedCity || !selectedDistrict) {
      toast.error('Adres seçimleri eksik!');
    } else {
      const newAddress = {
        country: selectedCountry,
        city: selectedCity,
        district: selectedDistrict,
      };

      try {
        const res = await fetch('http://localhost:3002/user/addAdress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            adress: newAddress
          })
        });

        const data = await res.json();

        if (res.status === 200) {
          toast.success(data.message);
          onAddressAdded();
          onClose();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error('Bir hata oluştu!');
      }
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
    <motion.div className='add-address-area'>
      <h1>Adres Ekle</h1>
      <select className='form-select addAddress' value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
        <option value="">Ülke Seçiniz</option>
        {countries.map(country => (
          <option key={country.iso2} value={country.iso2}>{country.name}</option>
        ))}
      </select>
      <select className='form-select addAddress' value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!selectedCountry}>
        <option value="">Şehir Seçiniz</option>
        {cities.map(city => (
          <option key={city.iso2} value={city.iso2}>{city.name}</option>
        ))}
      </select>
      <select className='form-select addAddress' value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedCity}>
        <option value="">İlçe Seçiniz</option>
        {districts.map(district => (
          <option key={district.iso2} value={district.iso2}>{district.name}</option>
        ))}
      </select>

      <motion.button
        className="add-address-button"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onClick={handleSubmit}
      >
        Ekle <MdAddHome className="add-address-icon" />
      </motion.button>
    </motion.div>
  );
};

export default AddressForm;
