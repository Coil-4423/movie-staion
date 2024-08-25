import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Navbar.css";
import "../css/searchbar.css";

const Navbar = ({ onSearchToggle, setMovieSection , onMenuToggle }) => {
  const [onSearch, setOnSearch] = useState(false);
  const [onMenu, setOnMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  const showSearch = () => {

    const newSearchState=!onSearch;
      setOnSearch(newSearchState);
      if(newMenuState&&onSearch){
      onSearchToggle(true);
      }else{
      onSearchToggle(newSearchState);
      }
 // Toggle blur state in parent
  };

  const toggleMenu = () => {
    const newMenuState = !onMenu
    setOnMenu(newMenuState);
    onMenuToggle(newMenuState);
  };
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  const handleInputFocus = () => {
    setSearchFocused(true);
  };
  
  const handleInputBlur = () => {
    setTimeout(() => {
      setSearchFocused(false);
    }, 200);
  };
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setSearchFocused(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlY2NiMWM0MTVkMWNjMTA3OTVhNGFkOWM4YjkyNmU2NSIsIm5iZiI6MTcyMTkyOTIxMi4xMDM0NDEsInN1YiI6IjY2ODgzNzQzNWQ1YWI2NGNlYzYxYTlmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2GCmTIGjgqcqcae8dOb9Js-B87fCTf1RJZXQ_kUQCO0", // Replace with your token
        },
      };
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setSearchResults(data.results);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSearchResults([]);
      setSearchFocused(false);
    }
  };
  
  const handleSuggestionClick = (id) => {
    navigate(`/movie/${id}`);
    clearSearch();
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchFocused(false);
  };

  useEffect(() => {
    setOnSearch(false);
    onSearchToggle(false);
    clearSearch();
  }, [location]);

  // Focus the search input when the search bar is active
  useEffect(() => {
    if (onSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [onSearch]);

  return (
    <div className={`navbar ${onSearch ? "search-active" : ""}`}>
      <div className="navbar-container">
        <div className="left-container">
          {!onSearch && (
            <>
              <IoIosMenu className="menu-icon" onClick={toggleMenu} />
              <div className="navbar-logo">
                <a href="/"><img src="/ms.svg" alt="Logo" /></a>
              </div>
              <div className={onMenu ? "navbar-links responsive" : "navbar-links"}>
                <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                  <Link to="/" className="link" onClick={() => setOnMenu(false)}>Home</Link>
                  <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
                    <button onClick={() => { setMovieSection("Now Playing"); navigate("/"); setOnMenu(false); }}>Now Playing</button>
                    <button onClick={() => { setMovieSection("Top Rated"); navigate("/"); setOnMenu(false); }}>Top Rated</button>
                    <button onClick={() => { setMovieSection("Upcoming"); navigate("/"); setOnMenu(false); }}>Upcoming</button>
                    <button onClick={() => { setMovieSection("Popular"); navigate("/"); setOnMenu(false); }}>Popular</button>
                  </div>
                </div>
                <Link to="/about" className="link" onClick={() => setOnMenu(false)}>About</Link>
                <Link to="/favorite" className="link" onClick={() => setOnMenu(false)}>Favorite</Link>
              </div>
            </>
          )}
        </div>
        {/* Conditionally render the search container */}
        {onSearch && (
          <div className={`search-container ${onSearch ? "active" : ""}`}>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="search-input"
              ref={searchInputRef}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={clearSearch}>
                &times;
              </button>
            )}
            {searchResults.length > 0 && searchFocused && (
              <div className="search-results">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="search-result-item"
                    onMouseDown={() => handleSuggestionClick(movie.id)}
                  >
                    <i className="fa fa-search"></i>
                    <span>{movie.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          className={`search-icon ${onSearch ? "active" : ""}`}
          onClick={showSearch}
        >
          <FaSearch />
        </button>
        {onSearch && (
          <button
            className="cancel-search"
            onClick={() => {
              clearSearch();
              showSearch();
            }}
          >
            cancel
          </button>
        )}
      </div>
      <button
        className="scroll-to-top"
        onClick={scrollTop}
        style={{ display: showScroll ? "block" : "none" }}
      >
        &#8679; {/* Unicode for an up arrow */}
      </button>
    </div>
    
  );
};

export default Navbar;