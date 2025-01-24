const App = () => {
    const [currentQuote, setCurrentQuote] = React.useState(null);
    const [quotes, setQuotes] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false); // State to control modal visibility
    const [isDataFetched, setIsDataFetched] = React.useState(false); // Track if data has been fetched
  
    // Function to get query parameter value from URL
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };
  
    // Fetch quotes from JSONBin using key and bin from query parameters
    const fetchQuotes = () => {
      const apiKey = getQueryParam('key');  // Get the API key from the query parameter
      const binId = getQueryParam('bin');  // Get the bin ID from the query parameter
  
      if (apiKey && binId) {
        fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
          method: 'GET',
          headers: {
            'X-Master-Key': apiKey, // JSONBin uses 'X-Master-Key' for authentication
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            setQuotes(data.record); // Assuming the quotes are stored in the 'record' field
            // Save the fetched quotes to localStorage
            localStorage.setItem('quotes', JSON.stringify(data.record));
            setIsDataFetched(true);
            // Set a random quote initially
            const randomIndex = Math.floor(Math.random() * data.record.length);
            setCurrentQuote(data.record[randomIndex]);
          })
          .catch(error => console.error('Error loading quotes:', error));
      } else {
        console.error('API key or bin ID is missing in the URL');
      }
    };
  
    // Load data from localStorage (if exists) or fetch data from JSONBin
    React.useEffect(() => {
      const storedQuotes = localStorage.getItem('quotes');
      if (storedQuotes) {
        // Use quotes from localStorage
        setQuotes(JSON.parse(storedQuotes));
        const randomIndex = Math.floor(Math.random() * JSON.parse(storedQuotes).length);
        setCurrentQuote(JSON.parse(storedQuotes)[randomIndex]);
        setIsDataFetched(true);
      } else {
        // If no quotes in localStorage, fetch them
        fetchQuotes();
      }
    }, []);
  
    const handleRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };
  
    const handleSettingsClick = () => {
      setShowModal(true); // Show modal when settings icon is clicked
    };
  
    const handleCloseModal = () => {
      setShowModal(false); // Close modal when clicking outside or on the close button
    };
  
    if (!currentQuote && isDataFetched === false) {
      return <div className="loading">Loading quotes...</div>; // Show a loading message until quotes are loaded
    }
  
    return (
      <div className="app-container">
        <div className="quote-container">
          <p className="quote">"{currentQuote.quote}"</p>
          <p className="author">- {currentQuote.author}</p>
        </div>
        <button onClick={handleRandomQuote} className="random-quote-button">
          🎲
        </button>
  
        {/* Settings Gear Icon */}
        <div className="settings-icon" onClick={handleSettingsClick}>
          ⚙️
        </div>
  
        {/* Modal for Settings */}
        {/* Modal for Settings */}
        {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Close the modal when clicking outside */}
            <div className="modal-header">
                <div className="settings-icon" onClick={handleCloseModal}>
                ⚙️
                </div>
                <h2>Settings</h2>
            </div>
            <div className="modal-body">
                {/* New 'Fetch Data' button styled */}
                <button onClick={fetchQuotes} className="fetch-data-button">
                Fetch Data
                </button>
            </div>
            </div>
        </div>
        )}

      </div>
    );
  };
  
  // Render React Component
  ReactDOM.render(<App />, document.getElementById('root'));
  