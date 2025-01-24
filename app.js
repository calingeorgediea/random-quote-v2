const App = () => {
    const [currentQuote, setCurrentQuote] = React.useState(null);
    const [quotes, setQuotes] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);
    const [isDataFetched, setIsDataFetched] = React.useState(false);
  
    // Function to get query parameter value from URL
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };
  
    // Fetch quotes from JSONBin using key and bin from query parameters
    const fetchQuotes = async () => {
      const apiKey = getQueryParam("key");
      const binId = getQueryParam("bin");
  
      if (apiKey && binId) {
        try {
          const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: "GET",
            headers: {
              "X-Master-Key": apiKey,
              "Content-Type": "application/json",
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error fetching quotes: ${response.statusText}`);
          }
  
          const data = await response.json();
          if (data.record && Array.isArray(data.record)) {
            setQuotes(data.record);
            localStorage.setItem("quotes", JSON.stringify(data.record));
            setIsDataFetched(true);
  
            const randomIndex = Math.floor(Math.random() * data.record.length);
            setCurrentQuote(data.record[randomIndex]);
          } else {
            console.error("Fetched data is not in the expected format.");
          }
        } catch (error) {
          console.error("Error loading quotes:", error);
        }
      } else {
        console.error("API key or bin ID is missing in the URL");
      }
    };
  
    // Load data from localStorage or fetch fresh data
    React.useEffect(() => {
      const initializeQuotes = async () => {
        try {
          const storedQuotes = localStorage.getItem("quotes");
  
          if (storedQuotes) {
            const parsedQuotes = JSON.parse(storedQuotes);
  
            if (Array.isArray(parsedQuotes) && parsedQuotes.length > 0) {
              setQuotes(parsedQuotes);
              const randomIndex = Math.floor(Math.random() * parsedQuotes.length);
              setCurrentQuote(parsedQuotes[randomIndex]);
              setIsDataFetched(true);
            } else {
              console.warn("Invalid quotes in localStorage. Fetching fresh data...");
              localStorage.removeItem("quotes");
              await fetchQuotes();
            }
          } else {
            console.log("No quotes in localStorage. Fetching fresh data...");
            await fetchQuotes();
          }
        } catch (error) {
          console.error("Error initializing quotes:", error);
          localStorage.removeItem("quotes");
          await fetchQuotes();
        }
      };
  
      initializeQuotes();
    }, []);
  
    const handleRandomQuote = () => {
      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIndex]);
      }
    };
  
    const handleSettingsClick = () => {
      setShowModal(true);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
    if (!currentQuote && !isDataFetched) {
      return <div className="loading">Loading quotes...</div>;
    }
  
    return (
      <div className="app-container">
        <div className="quote-container">
          {currentQuote ? (
            <React.Fragment>
              <p className="quote">"{currentQuote.quote}"</p>
              <p className="author">- {currentQuote.author}</p>
            </React.Fragment>
          ) : (
            <p className="quote">No quotes available.</p>
          )}
        </div>
        <button onClick={handleRandomQuote} className="random-quote-button">
          🎲
        </button>
  
        <div className="settings-icon" onClick={handleSettingsClick}>
          ⚙️
        </div>
  
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="settings-icon" onClick={handleCloseModal}>
                  ⚙️
                </div>
                <h2>Settings</h2>
              </div>
              <div className="modal-body">
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
  ReactDOM.render(<App />, document.getElementById("root"));
  