import axios from 'axios';

const API_URL = 'http://localhost:3000/countries';

// Fetch all countries
export const fetchCountries = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Fetch country by code
export const fetchCountryByCode = async (code: string) => {
  const response = await axios.get(`${API_URL}/${code}`);
  return response.data;
};

// Fetch countries by region
export const fetchCountriesByRegion = async (region: string) => {
  const response = await axios.get(`${API_URL}/region/${region}`);
  return response.data;
};

// Search countries by name, capital, region, timezone
export const searchCountries = async (params: { name?: string, capital?: string, region?: string, timezone?: string }) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}/search?${queryString}`);
  return response.data;
};