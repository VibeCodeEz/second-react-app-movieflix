import React, { useState, useEffect } from 'react';
import { testApiConnection, searchMovies } from '../services/movieService';

const ApiDebug: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [searchTest, setSearchTest] = useState<{ movies: any[]; totalResults: number } | null>(null);

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    setApiStatus('Testing API connection...');
    try {
      const isConnected = await testApiConnection();
      setApiStatus(isConnected ? '✅ API Connected' : '❌ API Failed');
      
      if (isConnected) {
        // Test a search
        const results = await searchMovies('movie', 1);
        setSearchTest(results);
      }
    } catch (error) {
      setApiStatus('❌ API Test Error');
      console.error('API test error:', error);
    }
  };

  const runSearchTest = async () => {
    try {
      const results = await searchMovies('movie', 1);
      setSearchTest(results);
    } catch (error) {
      console.error('Search test error:', error);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#333', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px', 
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4>API Debug</h4>
      <p>Status: {apiStatus}</p>
      <button onClick={testApi} style={{ margin: '5px' }}>
        Test API
      </button>
      <button onClick={runSearchTest} style={{ margin: '5px' }}>
        Test Search
      </button>
      {searchTest && (
        <div>
          <p>Search Results: {searchTest.movies.length} movies</p>
          <p>Total Results: {searchTest.totalResults}</p>
        </div>
      )}
    </div>
  );
};

export default ApiDebug; 