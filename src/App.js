import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';

function App() {









  const CryptoJS = require("crypto-js");


  function atkriptetajs(dati){
    let biti  = CryptoJS.AES.decrypt(dati, 'secret key 1');
    let atkriptetiDati = biti.toString(CryptoJS.enc.Utf8);
    return atkriptetiDati
  }

  function kriptetajs(dati){
    let kriptetiDati=CryptoJS.AES.encrypt(dati, 'secret key 1').toString()
   return kriptetiDati
 }














  // steits kur glabāsim autorus
  const [words, setWords] = useState([])
  // steits priekš jauna autora inputa
  const [newWord, setNewWord] = useState({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "", checked: 1})














  // funkcija lai paprasītu visus autorus no servera
  const fetchAllWords = () => {
    axios.get(`http://localhost:3004/${language}`).then((response) => {
      if(language==='japanese'){

        let atkriptetiVardi=[]
        

        atkriptetiVardi=response.data.map((neatkriptetsVards)=>{
          // console.log(neatkriptetsVards)
          let atkriptetsVards={}
          atkriptetsVards['id']=neatkriptetsVards.id
          atkriptetsVards['kanji']=atkriptetajs(neatkriptetsVards.kanji)
          atkriptetsVards['kunyomi']=atkriptetajs(neatkriptetsVards.kunyomi)
          atkriptetsVards['onyomi']=atkriptetajs(neatkriptetsVards.onyomi)
          atkriptetsVards['latValTulk']=atkriptetajs(neatkriptetsVards.latValTulk)
          atkriptetsVards['checked']=neatkriptetsVards.checked
          // console.log(atkriptetsVards)
          return atkriptetsVards
        })
        // setWords(response.data)
        setWords(atkriptetiVardi)
      }  
      else{
        let atkriptetiVardi=[]
        

        atkriptetiVardi=response.data.map((neatkriptetsVards)=>{
          // console.log(neatkriptetsVards)
          let atkriptetsVards={}
          atkriptetsVards['id']=neatkriptetsVards.id
          atkriptetsVards['word']=atkriptetajs(neatkriptetsVards.word)
          atkriptetsVards['latValTulk']=atkriptetajs(neatkriptetsVards.latValTulk)
          atkriptetsVards['checked']=neatkriptetsVards.checked
          // console.log(atkriptetsVards)
          return atkriptetsVards
        })
        // setWords(response.data)
        setWords(atkriptetiVardi)
      }




    });
  }



















  // izskauksies vienu reizi uz komponenta ielādi
  const [language, setLanguage] = useState('japanese')
  useEffect(() => {
    fetchAllWords();
    // eslint-disable-next-line
  }, [language]);


  











  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = language === "japanese"
      ? { kanji: kriptetajs(newWord.kanji) , onyomi: kriptetajs(newWord.onyomi), kunyomi: kriptetajs(newWord.kunyomi), latValTulk: kriptetajs(newWord.latValTulk)}
      : { word: kriptetajs(newWord.word), latValTulk: kriptetajs(newWord.latValTulk)};
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













  const handleDelete = (id) => {
    console.log(id)
    console.log(`http://localhost:3004/english/${id}`)
    axios.delete(`http://localhost:3004/${language}/${id}`).then((response) => {
      fetchAllWords();
    });
  };

  function handleCheckboxChange(event) {
    words[event.target.id-1].checked=event.target.checked
    console.log(words[event.target.id-1].checked=event.target.checked)
    try{
      console.log(getRandomObjectFromObjArray(filterList(words)))
    }
    catch (error) {
  console.error(error.message);
    }
  }


  // function handleCheckboxChange(event) {
  //   console.log(words)
  //   console.log(event.target)
  //   const updatedWords = [...words];
  //   updatedWords[event.target.id] = event.target.checked;
  //   setWords(updatedWords);
  //   try {
  //     console.log(getRandomObjectFromObjArray(filterList(updatedWords)));
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // }


  const [displayQuiz, setDisplayQuiz] = useState(false);
  function changeOverlayQuiz() {
    if(displayQuiz){
      setDisplayQuiz(false)
      setDisplayQuizAnswer(false)
    }else{
      updateQuiz(words)
      setDisplayQuiz(true)
      let newDisplayword = getRandomObjectFromObjArray(filterList(words));
      setDisplaywordKanji(newDisplayword ? newDisplayword : fullObj);
    }
  }

  const [displayQuizAnswer, setDisplayQuizAnswer] = useState(false);
  function changeOverlayAnswer() {
    if(displayQuizAnswer){
      setDisplayQuizAnswer(false)  
    }else{
    setDisplayQuizAnswer(true)
  }
  }



  // Pārbauda vai vārdam ir atzīmēts checkbox
  function filterList(objArray) {
    let filteredList = objArray.filter(item => item.checked === 1||item.checked === true);
    return filteredList
  }
  

  const fullObj={ kanji: "click the new word button, to start the quiz", onyomi: newWord.onyomi, kunyomi: newWord.kunyomi, latValTulk: newWord.latValTulk , checked:1}

  function getRandomObjectFromObjArray(objArray) {
    const randomIndex = Math.floor(Math.random() * objArray.length);
    return objArray[randomIndex];
  }

  function updateQuiz(){
    let newDisplayword = getRandomObjectFromObjArray(filterList(words));
    setDisplaywordKanji(newDisplayword ? newDisplayword : fullObj);

  }

  const [displaywordKanji, setDisplaywordKanji] = useState(filterList(words)[0] || fullObj)


  return (
    
    <div className="App">
      <head>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossOrigin="anonymous"></link>
      </head>
      

      
      <header className="App-header">
        <div id='screenOverlay ' className={`Screen-overlay ${displayQuiz ? '' : 'hidden'}`}>
          <form className='vw-50 vh-80 align-middle'>
            <div className='quiz-wrapper vw-50 vh-80 '>
              <div className='quiz p-1 border border-dark border-2'>
                <div>
                  <h1 className='bg-light text-dark p-1'>Vārds svešvalodā</h1>
                  <div className=' quiz-bg '>
                    <h1 className='border border-light border-2'>{language==='english' ? String(displaywordKanji.word) : String(displaywordKanji.kanji)}</h1>
                  
                    <h1 className={`Answer ${displayQuizAnswer ? '' : 'hidden'}  border border-light border-2`}>{String(displaywordKanji.latValTulk)}</h1>
                  </div>
                  
                </div>
                <Button className='mb-1' variant="primary" onClick={updateQuiz}>jauns vārds</Button>{' '}
                <Button variant="light" onClick={changeOverlayAnswer}>rādīt/slēpt nozīmi</Button>{' '}
              </div>
            </div>
          </form>
        </div>


        <div className="navbar navbar-height smart-scroll fixed-top navbar-expand-lg navbar-light bg-white py-0 mdshadow-1 text-dark ">
          <button onClick={changeOverlayQuiz}>quiz</button>
          <h2 >Flash kāršu(Flash card) veidotājs un svešvārdu atkārtotājs</h2>
        </div>
        
        <h2 className=' mt-5'>Pievieno jaunu kārti</h2>
        




        <form>
          <select name="Valoda" id="language" onChange={(e) => {
            setLanguage(e.target.value);
            setNewWord({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "" , checked:1});
            fetchAllWords()
            }}>
            <option value="japanese">Japāņu</option>
            <option value="english">Angļu</option>
          </select>
        </form>
        


        {language === "japanese" ? (
          <form onSubmit={handleSubmit}  >
            <input 
              required
              placeholder='Vārds'
              type="text"
              className=' input_field'
              value={newWord.kanji}
              onChange={(e) => {
                const updatedNewWord={...newWord,
                  kanji:e.target.value}
                setNewWord(updatedNewWord)
              }}
            /> 
{/* <div class="form-floating mb-3">
  <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"></input>
  <label for="floatingInput">Email address</label>
</div> */}

            <br />
            <input 
              // required
              placeholder='Onyomi izrunas'
              type="text"
              className=' input_field'
              value={newWord.onyomi}
              onChange={(e) => {
                const updatedNewWord={...newWord,
                  onyomi:e.target.value}
                setNewWord(updatedNewWord)
              }}
            /> 
            <br />
            <input 
              // required
              placeholder='Kunyomi izrunas'
              type="text"
              className=' input_field'
              value={newWord.kunyomi}
              onChange={(e) => {
                const updatedNewWord={...newWord,
                  kunyomi:e.target.value}
                setNewWord(updatedNewWord)
              }}
            /> 
            <br />
            <input 
              required
              placeholder='Vārda nozīme latviešu valodā'
              type="text"
              className=' input_field'
              value={newWord.latValTulk}
              onChange={(e) => {
                const updatedNewWord={...newWord,
                  latValTulk:e.target.value}
                setNewWord(updatedNewWord)
              }}
            /> 
            <br />
            <button>
              Pievienot vārdu
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
          )
        }



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
                  <label>
                    <input id={word.id} type="checkbox" defaultChecked onChange={handleCheckboxChange} />
                    Check me 
                    {/* {console.log(word)} */}
                  </label>
                  <button onClick={() => handleDelete(word.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
          ) : (
          words.map((word) => (
            
            
            <div key={word.id} className='.grid-item'>
              
              <div className='grid-item-wrapper-inner'>
                <div key={word.id}>
                  <h2 >{word.word}</h2>
                  <h3 className='nozLatVal'>Nozīme latviešu valodā:<br></br>{word.latValTulk}</h3>
                  <label>
                    <input id={word.id} type="checkbox" defaultChecked onChange={handleCheckboxChange} />
                    Check me
                  </label>
                  <button onClick={() => handleDelete(word.id)}>Delete</button>   
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </header>
    </div>
  );
  
}

export default App;