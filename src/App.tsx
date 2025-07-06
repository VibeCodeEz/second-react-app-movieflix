import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar.tsx';
import Home from './components/Home.tsx';
import Movies from './components/Movies.tsx';
import MovieDetail from './components/MovieDetail.tsx';
import Watchlist from './components/Watchlist.tsx';
import ApiDebug from './components/ApiDebug.tsx';
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
          <ApiDebug />
      </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
