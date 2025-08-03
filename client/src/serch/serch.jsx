
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../Redux/productsSlice';
import SearchBar from './serchbar';
import SearchResults from './serchresult';

function Serch() {
  const dispatch = useDispatch();

  const { items: products, loading, error } = useSelector(state => state.products);

  const [query, setQuery] = useState('');
  const [filteredCakes, setFilteredCakes] = useState([]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleSearch = () => {
    const results = products.filter(cake =>
      cake.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCakes(results);
  };

  if (loading) return <div>טוען מוצרים...</div>;
  if (error) return <div>שגיאה: {error}</div>;

  return (
    <>
      <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
      <main style={{ marginTop: '80px' }}>
        <SearchResults cakes={filteredCakes} />
      </main>
    </>
  );
}

export default Serch;

