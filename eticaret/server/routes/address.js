import express from 'express';
import axios from 'axios';
import { Router } from 'express';
import { getCity, getCityName, getCountries, getDistricts } from '../controllers/address.js';

export const router = Router();

router.get('/countries', getCountries);
router.get('/cities', getCity);
router.get('/districts', getDistricts);
router.get('/getCityName', getCityName);

