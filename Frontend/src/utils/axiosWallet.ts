import axios from 'axios';

const axiosWallet = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/',
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json',
  },
});

export default axiosWallet;
