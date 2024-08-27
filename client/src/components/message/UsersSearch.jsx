import { useContext, useState, useCallback } from 'react';
import axios from 'axios';
import TokenContext from '../TokenContext';

const useSearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(TokenContext);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/users/search`, {
        params: { q: query },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API Response:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [query, token]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return {
    query,
    results,
    loading,
    handleSearch,
    handleChange,
    setQuery,
    setResults
  };
};

export default useSearchUsers;