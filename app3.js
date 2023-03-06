import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';





function App() {
  // steits kur glabāsim autorus
  const [words, setWords] = useState([])
  // steits priekš jauna autora inputa
  const [newWord, setNewWord] = useState({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "" })

  // funkcija lai paprasītu visus autorus no servera
  const fetchAllWords = () => {
    axios.get('http://localhost:3004/japanese').then((response) => {

      setWords(response.data)
    });
  }

  const [language, setLanguage] = useState('japanese')

  // izskauksies vienu reizi uz komponenta ielādi
  useEffect(() => {
    fetchAllWords()
  }, [])







  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:3004/${language}`, newWord)
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
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
      </head>
      <header className="App-header">
        <div class="navbar navbar-height smart-scroll fixed-top navbar-expand-lg navbar-light bg-white py-0 mdshadow-1">


        </div>
        <h2>Insert a new word</h2>



        <form>
          <select name="Valoda" id="language" onChange={(e) => {
            setLanguage(e.target.value);
            console.log(language)
          }}>
            <option value="japanese">Japāņu</option>
            <option value="english">Angļu</option>
          </select>
        </form>
        


        {language === "japanese" ? (

<form onSubmit={handleSubmit}>


            
          <input 
            required
            placeholder='kanji...'
            type="text"
            value={newWord.kanji}
            onChange={(e) => {
              const updatedNewWord={...newWord,
                kanji:e.target.value}
              setNewWord(updatedNewWord)
              console.log(newWord)
            }}
          /> 
          <br />
          <input 
            required
            placeholder='kanji onyomi...'
            type="text"
            value={newWord.onyomi}
            onChange={(e) => {
              const updatedNewWord={...newWord,
                onyomi:e.target.value}
              setNewWord(updatedNewWord)
              console.log(newWord)
            }}
          /> 
          <br />
          <input 
            required
            placeholder='Kanji kunyomi'
            type="text"
            value={newWord.kunyomi}
            onChange={(e) => {
              const updatedNewWord={...newWord,
                kunyomi:e.target.value}
              setNewWord(updatedNewWord)
              console.log(newWord)
            }}
          /> 
          <br />
          <input 
            required
            placeholder='Kanji latValTulk'
            type="text"
            value={newWord.latValTulk}
            onChange={(e) => {
              const updatedNewWord={...newWord,
                latValTulk:e.target.value}
              setNewWord(updatedNewWord)
              console.log(newWord)
            }}
          /> 
          <br />
          <button>
            Add new painting
          </button>
        </form>): (






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








        <div className='grid-container'> 
          {words.map((word) => (
            <div key={word.id} className='.grid-item'>
              <div class='grid-item-wrapper-inner'>
                <div key={word.id}>
                <h2 >{word.kanji}</h2>
                <h3 >Onyomi:  {word.onyomi}</h3>
                <h3 >Kunyomi:   {word.kunyomi}</h3>
                <h3 class='nozLatVal'>Nozīme latviešu valodā:<br></br>{word.latValTulk}</h3>
                {/* <img src={glezna.imgSrc} width='50%'/> */}
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </header>
      {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script> */}
    </div>
  );
  
}

export default App;