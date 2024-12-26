import axios from 'axios';

export const getCountries = async (req, res) => {
    try {
        const response = await axios.get('https://api.countrystatecity.in/v1/countries', {
            headers: {
                "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=="
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ülkeleri alma başarısız.');
    }
};

export const getCity = async (req, res) => {
    const { countryCode } = req.query;
    try {
        const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
            headers: {
                "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=="
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Şehirleri alma başarısız.');
    }
};

export const getCountryName = async (req, res) => {
    const { countryCode } = req.query;

    try {
        const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}}`, {
            headers: {
                "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=="
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Şehirleri alma başarısız.');
    }
}
export const getCityName = async (req, res) => {
    const { countryCode, cityCode } = req.query;

    try {
        const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${cityCode}`, {
            headers: {
                "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=="
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Şehirleri alma başarısız.');
    }
}

export const getDistricts = async (req, res) => {
    const { countryCode, stateCode } = req.query;
    try {
        const response = await axios.get(`https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`, {
            headers: {
                "X-CSCAPI-KEY": "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=="
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('İlçeleri alma başarısız.');
    }
};


/*

!!Burayı bir süreliğine bekletiyorum şimdilik ülke il ilçe bilgilerini çekeceğim!!

export const getNeighborhoods = async (req, res) => {
    const { districtId } = req.query;
    try {
        const response = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${districtId}&username=${geonamesUsername}`);
        res.json(response.data.geonames);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch neighborhoods' });
    }
};

export const getStreets = async (req, res) => {
    const { neighborhoodId } = req.query;
    try {
        const response = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${neighborhoodId}&username=${geonamesUsername}`);
        res.json(response.data.geonames);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch streets' });
    }
};

*/
