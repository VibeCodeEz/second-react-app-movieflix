import React, { useState, useEffect } from 'react';
import { testApiConnection, searchMovies } from '../services/movieService';

const ApiDebug: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('Testing...');
  const [searchTest, setSearchTest] = useState<{ movies: unknown[]; totalResults: number } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    testApi();
  }, []);

  const testApi = async () => {
    setApiStatus('Testing API connection...');
    setDebugInfo('Checking environment variables and API configuration...');
    
    try {
      // Log environment variables (without exposing the actual key)
      const apiKey = import.meta.env.VITE_OMDB_API_KEY;
      const baseUrl = import.meta.env.VITE_OMDB_BASE_URL;
      
      setDebugInfo(`API Key: ${apiKey ? 'Present' : 'Missing'}\nBase URL: ${baseUrl || 'Not set'}`);
      
      const isConnected = await testApiConnection();
      setApiStatus(isConnected ? '✅ API Connected' : '❌ API Failed');
      
      if (isConnected) {
        // Test a search
        const results = await searchMovies('movie', 1);
        setSearchTest(results);
        setDebugInfo(prev => prev + '\n✅ Search test successful');
      } else {
        setDebugInfo(prev => prev + '\n❌ API connection failed - check console for details');
      }
    } catch (error) {
      setApiStatus('❌ API Test Error');
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('API test error:', error);
    }
  };

  const runSearchTest = async () => {
    try {
      setDebugInfo('Running search test...');
      const results = await searchMovies('movie', 1);
      setSearchTest(results);
      setDebugInfo(prev => prev + '\n✅ Search test completed');
    } catch (error) {
      setDebugInfo(prev => prev + `\n❌ Search test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Search test error:', error);
    }
  };

  const checkEnvironment = () => {
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;
    const baseUrl = import.meta.env.VITE_OMDB_BASE_URL;
    
    setDebugInfo(`Environment Check:\nAPI Key: ${apiKey ? 'Present' : 'Missing'}\nBase URL: ${baseUrl || 'Not set'}\nNode Env: ${import.meta.env.DEV ? 'Development' : 'Production'}`);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#333', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '8px', 
      fontSize: '12px',
      zIndex: 1000,
      maxWidth: '350px',
      maxHeight: '400px',
      overflow: 'auto',
      border: '1px solid #555'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🔧 API Debug</h4>
      <p style={{ margin: '5px 0', fontSize: '11px' }}>Status: {apiStatus}</p>
      
      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={testApi} 
          style={{ 
            margin: '2px', 
            padding: '4px 8px', 
            fontSize: '10px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Test API
        </button>
        <button 
          onClick={runSearchTest} 
          style={{ 
            margin: '2px', 
            padding: '4px 8px', 
            fontSize: '10px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Test Search
        </button>
        <button 
          onClick={checkEnvironment} 
          style={{ 
            margin: '2px', 
            padding: '4px 8px', 
            fontSize: '10px',
            background: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Check Env
        </button>
      </div>
      
      {searchTest && (
        <div style={{ marginBottom: '10px' }}>
          <p style={{ margin: '5px 0', fontSize: '11px' }}>
            Search Results: {searchTest.movies.length} movies
          </p>
          <p style={{ margin: '5px 0', fontSize: '11px' }}>
            Total Results: {searchTest.totalResults}
          </p>
        </div>
      )}
      
      {debugInfo && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          background: '#222', 
          borderRadius: '4px',
          fontSize: '10px',
          whiteSpace: 'pre-wrap',
          maxHeight: '150px',
          overflow: 'auto'
        }}>
          {debugInfo}
        </div>
      )}
    </div>
  );
};

export default ApiDebug; 