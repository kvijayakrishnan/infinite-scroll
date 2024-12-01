import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const InfiniteScroll = () => {
  const [data, setData] = useState([]); // Store fetched data
  const [page, setPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // If more data is available

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      if (response.data.length > 0) {
        setData((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false); // No more data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Trigger fetchData on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 10
      ) {
        fetchData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchData]);

  return (
    <div>
      <h1>Infinite Scroll</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more items to load</p>}
    </div>
  );
};

export default InfiniteScroll;
