import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 });

dotenv.config();

const router = express.Router();
const REST_COUNTRIES_API = process.env.REST_COUNTRIES_API;


router.get('/', async (req: Request, res: Response) => {
    try {
        const cachedCountries = cache.get('allCountries');

        if (cachedCountries) {
            res.json(cachedCountries);
        } else {
            const response = await axios.get(`${REST_COUNTRIES_API}/all`);
            cache.set('allCountries', response.data);
            res.json(response.data);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching country data' });
    }
});


router.get('/region/:region', async (req: Request, res: Response) => {
    const region = req.params.region.toLowerCase();
    const cachedRegion = cache.get(`region_${region}`);

    if (cachedRegion) {
        res.json(cachedRegion);
    } else {
        try {
            const response = await axios.get(`${REST_COUNTRIES_API}/region/${region}`);
            cache.set(`region_${region}`, response.data);
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching countries by region' });
        }
    }
});


router.get('/search', async (req: Request, res: Response) => {
  const { name, capital, region, timezone } = req.query;
  let url = `${REST_COUNTRIES_API}/all`;
  try {
    const response = await axios.get(url);
    let countries = response.data;
    if (name) countries = countries.filter((c: any) => c.name.common.toLowerCase().includes((name as string).toLowerCase()));
    if (capital) countries = countries.filter((c: any) => c.capital?.[0]?.toLowerCase() === (capital as string).toLowerCase());
    if (region) countries = countries.filter((c: any) => c.region.toLowerCase() === (region as string).toLowerCase());
    if (timezone) countries = countries.filter((c: any) => c.timezones.includes(timezone as string));

    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error searching countries' });
  }
});


router.get('/:code', async (req: Request, res: Response) => {
    const countryCode = req.params.code.toUpperCase();
    const cachedCountry = cache.get(`country_${countryCode}`);

    if (cachedCountry) {
        res.json(cachedCountry);
    } else {
        try {
            const response = await axios.get(`${REST_COUNTRIES_API}/alpha/${countryCode}`);
            cache.set(`country_${countryCode}`, response.data);
            res.json(response.data);
        } catch (error) {
            res.status(404).json({ message: 'Country not found' });
        }
    }
});

export default router;
