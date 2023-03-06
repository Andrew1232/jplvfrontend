import React, { useState } from "react";
import axios from "axios";

function App() {
  const [newWord, setNewWord] = useState({
    kanji: "",
    onyomi: "",
    kunyomi: "",
    latValTulk: "",
  });
  const [language, setLanguage] = useState("japanese");
  const [words, setWords] = useState([])
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    console.log(language)
  };
  const fetchAllWords = () => {
    axios.get('http://localhost:3004/japanese').then((response) => {

      setWords(response.data)
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3004/${language}`, newWord)
      .then(() => {
        fetchAllWords();
        setNewWord({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "" });
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while adding the word. Please try again later.");
      });
  };

  return (
    <div className="App">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossorigin="anonymous"
        ></link>
      </head>
      <header className="App-header">
        <div class="navbar navbar-height smart-scroll fixed-top navbar-expand-lg navbar-light bg-white py-0 mdshadow-1"></div>
        <h2>Insert a new word</h2>
        <form>
          <select name="Valoda" id="language" onChange={handleLanguageChange}>
            <option value="japanese">Japāņu</option>
            <option value="english">Angļu</option>
          </select>
        </form>
        {language === "japanese" ? (
          <form onSubmit={handleSubmit}>
            <input
              required
              placeholder="kanji..."
              type="text"
              value={newWord.kanji}
              onChange={(e) => {
                const updatedNewWord = { ...newWord, kanji: e.target.value };
                setNewWord(updatedNewWord);
              }}
            />
            <br />
            <br />
            <input
              required
              placeholder="onyomi..."
              type="text"
              value={newWord.onyomi}
              onChange={(e) => {
                const updatedNewWord = { ...newWord, onyomi: e.target.value };
                setNewWord(updatedNewWord);
              }}
            />
            <br />
            <br />
            <input
              required
              placeholder="kunyomi..."
              type="text"
              value={newWord.kunyomi}
              onChange={(e) => {
                const updatedNewWord = { ...newWord, kunyomi: e.target.value };
                setNewWord(updatedNewWord);
              }}
            />
            <br />
            <br />
            <input
              required
              placeholder="nozīme latviešu valodā..."
              type="text"
              value={newWord.latValTulk}
              onChange={(e) => {
                const updatedNewWord = {
                  ...newWord,
                  latValTulk: e.target.value,
                };
                setNewWord(updatedNewWord);
              }}
            />
<br />
            <br />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              required
              placeholder="word..."
              type="text"
              value={newWord.kanji}
              onChange={(e) => {
                const updatedNewWord = { ...newWord, kanji: e.target.value };
                setNewWord(updatedNewWord);
              }}
            />
            <br />
            <br />
            <input
              required
              placeholder="definition in Latvian..."
              type="text"
              value={newWord.latValTulk}
              onChange={(e) => {
                const updatedNewWord = {
                  ...newWord,
                  latValTulk: e.target.value,
                };
                setNewWord(updatedNewWord);
              }}
            />
            <br />
            <br />
            <button type="submit">Submit</button>
          </form>
        )}
      </header>
    </div>
  );
}
export default App;