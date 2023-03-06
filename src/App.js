import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';





function App() {
  // steits kur glabāsim autorus
  const [words, setWords] = useState([])
  // steits priekš jauna autora inputa
  const [newWord, setNewWord] = useState({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "", checked: 1})

  // funkcija lai paprasītu visus autorus no servera
  const fetchAllWords = () => {
    axios.get(`http://localhost:3004/${language}`).then((response) => {
      setWords(response.data)
    });
  }


  

  const [language, setLanguage] = useState('japanese')

  // izskauksies vienu reizi uz komponenta ielādi
  useEffect(() => {
    fetchAllWords();
  }, [language]);

  function generateWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    return randomWord
  }
  
  function createList(length){
    return    Array(8).fill().map((element, index) => index)
  }

  function shuffle(list) {
    var j, x, i;
    for (i = list.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = list[i];
        list[i] = list[j];
        list[j] = x;
    }
    return list;
}


  

  // const [isChecked, setIsChecked] = useState(0);

  function handleCheckboxChange(event) {
    // setIsChecked(event.target.checked);
    console.log(event.target.checked)
    console.log(event.target.id)
    // console.log(words[event.target.id-1])
    words[event.target.id-1].checked=event.target.checked
    console.log(words[event.target.id-1].checked=event.target.checked)
    // console.log(words[event.target.id-1])
    // setNewWord((prev) => ({ ...prev, checked: event.target.checked }));
    console.log(words)
  }


//  function quizButton(){
//   console.log(shuffle(createList(words.length)))
//  }
//   // pushCheckValue




  
  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = language === "japanese"
      ? { kanji: newWord.kanji, onyomi: newWord.onyomi, kunyomi: newWord.kunyomi, latValTulk: newWord.latValTulk}
      : { word: newWord.word, latValTulk: newWord.latValTulk };
    axios.post(`http://localhost:3004/${language}`, requestData)
      .then(() => {
        fetchAllWords();
        setNewWord({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "", checked:1 });
      })
      .catch((error) => {
        console.error(error);
        alert("An error occurred while adding the word. Please try again later.");
      });
  };
  






// const handleDelete=(e, word)=>{
//     e.preventDefault();
//     console.log('hello')
//     axios.delete(`http://localhost:3004/${language}`, word.id)
//         .catch((error) => {
//           console.error(error);
//           alert("An error occurred while deleting the word. Please try again later.");

//   })}




// const handleDelete = (e, word) => {
//   e.preventDefault();
//   axios.delete(`http://localhost:3004/${language}/${word.id}`)
//     .then(() => {
//       fetchAllWords();
//     })
//     .catch((error) => {
//       console.error(error);
//       alert("An error occurred while deleting the word. Please try again later.");
//     });
// };
  



const handleDelete = (word) => {
  axios.delete(`http://localhost:3004/${language}`, {id:word.id})
    .then(() => {
      console.log('delete', word.id)
      fetchAllWords();
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred while deleting the word. Please try again later.");
    });
};






  const [displayQuiz, setDisplayQuiz] = useState(false);
  function changeOverlay() {
    if(displayQuiz){
      setDisplayQuiz(false)
    }else{
    setDisplayQuiz(true)
  }
  }








  return (
    
    <div className="App">
      <head>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossOrigin="anonymous"></link>
      </head>
      

      






      
      <header className="App-header">
      <div id='screenOverlay' className={`Screen-overlay ${displayQuiz ? 'display' : ''}`}>
      <form>
        <div>
          aaaaaaa
          {generateWord}
        </div>
        <button onClick={()=>generateWord()}></button>
      </form>

</div>




      




      
        <div className="navbar navbar-height smart-scroll fixed-top navbar-expand-lg navbar-light bg-white py-0 mdshadow-1">


        






        <button onClick={changeOverlay}>quiz</button>


          {/* console.log(shuffle(createList(words.length()))) */}








        </div>
        <h2>Insert a new word</h2>























        <form>
          <select name="Valoda" id="language" onChange={(e) => {
            setLanguage(e.target.value);
            setNewWord({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "" , checked:1});
            fetchAllWords()
            
            // console.log(language)
            // console.log(words)

            
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
              // console.log(newWord)
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
              // console.log(newWord)
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
              // console.log(newWord)
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
              // console.log(newWord)
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
              value={newWord.word}
              onChange={(e) => {
                const updatedNewWord = { ...newWord, word: e.target.value };
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

{language === "japanese" ? (
words.map((word) => (
<div key={word.id} className='.grid-item'>
  <div className='grid-item-wrapper-inner'>
    <div key={word.id}>
    <h2 >{word.kanji}</h2>
    <h3 >Onyomi:  {word.onyomi}</h3>
    <h3 >Kunyomi:   {word.kunyomi}</h3>
    <h3 className='nozLatVal'>Nozīme latviešu valodā:<br></br>{word.latValTulk}</h3>
    
    </div>
  </div>
  
</div>
))
) : (
words.map((word) => (
  <div key={word.id} className='.grid-item'>
    <div className='grid-item-wrapper-inner'>
      {/* {console.log(word)} */}
      <div key={word.id}>
      <h2 >{word.word}</h2>
      <h3 className='nozLatVal'>Nozīme latviešu valodā:<br></br>{word.latValTulk}</h3>
      <label>
        <input id={word.id} type="checkbox" defaultChecked onChange={handleCheckboxChange} />
        Check me
      </label>
      <button onClick={() => handleDelete(word)}>Delete</button>
      
      
      </div>
    </div>
    
  </div>
))
)}





 
        </div>


      </header>
      {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script> */}
    </div>
  );
  
}

export default App;





