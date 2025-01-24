const App = () => {
    const [currentQuote, setCurrentQuote] = React.useState(null);
    const [quotes, setQuotes] = React.useState([]);
    const [isDataFetched, setIsDataFetched] = React.useState(false);
  
    // Fetch quotes from JSONBin using key and bin from query parameters
    const fetchQuotes = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const apiKey = urlParams.get("key");
      const binId = urlParams.get("bin");
  
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
            const randomIndex = Math.floor(Math.random() * data.record.length);
            setCurrentQuote(data.record[randomIndex]);
            setIsDataFetched(true);
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
  
    React.useEffect(() => {
      fetchQuotes();
    }, []);
  
    if (!currentQuote && !isDataFetched) {
      return <div className="loading">Loading...</div>;
    }
  
    return (
      <div className="widget-container">
        <div className="quote">
          "{currentQuote.quote}"
        </div>
        <div className="author">- {currentQuote.author}</div>
      </div>
    );
  };
  
  // Render React Component
  ReactDOM.render(<App />, document.getElementById("root"));
  