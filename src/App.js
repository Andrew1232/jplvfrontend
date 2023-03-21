import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Button from 'react-bootstrap/Button';

function App() {

  // atslēga, kuru izmanto kriptēšanai
  const slepenaAtslega='secret key 1';
  // importē kriptēšanas rīku
  const CryptoJS = require("crypto-js");
  // funkcija, kuru izmanto lai kriptētu datus, kuri tiek sūtīti uz backend un vēlāk uz datubāzi
  function atkriptetajs(dati){
    let biti  = CryptoJS.AES.decrypt(dati, slepenaAtslega);
    let atkriptetiDati = biti.toString(CryptoJS.enc.Utf8);
    return atkriptetiDati
  }
  // funkcija, kuru izmanto lai atšifrētu no backend iegūtos datus
  function kriptetajs(dati){
    let kriptetiDati=CryptoJS.AES.encrypt(dati, slepenaAtslega).toString()
    return kriptetiDati
  }

  // steits kur glabā vārdus
  const [vardi, setVardi] = useState([])
  // steits priekš jauna vārda, kuru var ievadīt frontend
  const [jaunsVards, setJaunoVardu] = useState({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "", checked: 1})

  // funkcija lai paprasītu visus vārdus no servera
  const fetchVisusVardus = () => {
    axios.get(`http://localhost:3004/${valoda}`).then((atbilde) => {
      let atkriptetiVardi=[]
      if(valoda==='japanu'){
        atkriptetiVardi=atbilde.data.map((neatkriptetsVards)=>{
          let atkriptetsVards={}
          atkriptetsVards['id']=neatkriptetsVards.id
          atkriptetsVards['kanji']=atkriptetajs(neatkriptetsVards.kanji)
          atkriptetsVards['kunyomi']=atkriptetajs(neatkriptetsVards.kunyomi)
          atkriptetsVards['onyomi']=atkriptetajs(neatkriptetsVards.onyomi)
          atkriptetsVards['latValTulk']=atkriptetajs(neatkriptetsVards.latValTulk)
          atkriptetsVards['checked']=neatkriptetsVards.checked
          return atkriptetsVards
        })
        setVardi(atkriptetiVardi)
      }  
      else{
        atkriptetiVardi=atbilde.data.map((neatkriptetsVards)=>{
          let atkriptetsVards={}
          atkriptetsVards['id']=neatkriptetsVards.id
          atkriptetsVards['word']=atkriptetajs(neatkriptetsVards.word)
          atkriptetsVards['latValTulk']=atkriptetajs(neatkriptetsVards.latValTulk)
          atkriptetsVards['checked']=neatkriptetsVards.checked
          return atkriptetsVards
        })
        setVardi(atkriptetiVardi)
      }
    });
  }

  // steits, kur glabā atzīmēto valodu
  const [valoda, setValoda] = useState('japanu')

  // izsauksies vienu reizi uz komponenta ielādi
  useEffect(() => {
    fetchVisusVardus();
    // eslint-disable-next-line
  }, [valoda]);

  // funkcija, kas atbild par jauna vārda augšuplādi uz datubāzi
  const handleSubmit = (e) => {
    e.preventDefault();
    const pieprasijumaDati = valoda === "japanu"
      ? { kanji: kriptetajs(jaunsVards.kanji) , onyomi: kriptetajs(jaunsVards.onyomi), kunyomi: kriptetajs(jaunsVards.kunyomi), latValTulk: kriptetajs(jaunsVards.latValTulk)}
      : { word: kriptetajs(jaunsVards.word), latValTulk: kriptetajs(jaunsVards.latValTulk)};
    axios.post(`http://localhost:3004/${valoda}`, pieprasijumaDati)
      .then(() => {
        fetchVisusVardus();
        setJaunoVardu({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "", checked:1 });
      })
      .catch((kluda) => {
        console.error(kluda);
        alert("Tika sastapta kļūda, kamēr centās augšuplādēt vārdu. Lūdzu pamēģiniet atkal vēlāk.");
      });
  };

  // funkcija, kas atbild par nevēlama vārda izdzēšanas no datubāzes
  const handleDzesanu = (id) => {
    axios.delete(`http://localhost:3004/${valoda}/${id}`).then((atbilde) => {
      fetchVisusVardus();
    });
  };

  // Funkcija, kas izfiltrē vārdus, kuriem ir atzīmēts checkbox
  function filtretSarakstu(objSaraksts) {
    let filtretsSaraksts = objSaraksts.filter(item => item.checked === 1||item.checked === true);
    return filtretsSaraksts
  }

  // funkcija, kura no objekta pēc nejaušības principa izvēlas vārdu 
  function iegutNejausuObjektuNoSaraksta(objSaraksts) {
    const nejaussIndekss = Math.floor(Math.random() * objSaraksts.length);
    return objSaraksts[nejaussIndekss];
  }

  // funkcija, kas atbild par vārda checked vērtības maiņu, kad tiek atzīmēta izvēles rūtiņa
  function handleIzvelesRurinasMainu(notikums) {
    try{
      vardi[notikums.target.id-1].checked=notikums.target.checked
      console.log(vardi[notikums.target.id-1].checked)
    }
    catch (error) {
      console.error(error.message);
    }
  }

  // noklusejumaObjekts, kuru izmanto, ja atzīmētajā valodā nav vārdu
  const noklusejumaObjekts={ kanji: "Nav atzīmēts neviens vārds atkārtošanai. Atzīmē ar ķeksīti tos vārdus, kurus tu vēlies atkārtot, un tad atgriezies šeit", word:"Nav atzīmēts neviens vārds atkārtošanai. Atzīmē ar ķeksīti tos vārdus, kurus tu vēlies atkārtot, un tad atgriezies šeit", onyomi: jaunsVards.onyomi, kunyomi: jaunsVards.kunyomi, latValTulk: jaunsVards.latValTulk , checked:1}

  // steits, kurš atbild par to vai atkārtošanas pārklājums ir slēpts vai redzams
  const [parklajumaRedzamiba, setParklajumaRedzamibu] = useState(false);
  // funkcija, kura maina atkārtošanas pārklājuma redzamības steitu
  function mainitParklajumaRedzamibu() {
    if(parklajumaRedzamiba){
      setParklajumaRedzamibu(false)
      setParklajumaAtbildeRedzamiba(false)
    }else{
      atjauninatParklajumu(vardi)
      setParklajumaRedzamibu(true)
      let jaunaisAtkartojamaisVards = iegutNejausuObjektuNoSaraksta(filtretSarakstu(vardi));
      setAtkartojamoVardu(jaunaisAtkartojamaisVards ? jaunaisAtkartojamaisVards : noklusejumaObjekts);
    }
  }

  // steits, kurš nosaka vai atkārtojamā vārda nozīme latviešu valodā ir redzama
  const [parklajumaAtbildeRedzamiba, setParklajumaAtbildeRedzamiba] = useState(false);
  // funkcija, kura maina atkārtojamā vārda redzamības steitu
  function mainitAtbildesRedzamibu() {
    if(parklajumaAtbildeRedzamiba){
      setParklajumaAtbildeRedzamiba(false)  
    }
    else{
      setParklajumaAtbildeRedzamiba(true)
    }
  }

  // steits, kurš nosaka, kurš vārds uzrādīsies vārdu atkārtojuma pārklājumā
  const [atkartojamaisVards, setAtkartojamoVardu] = useState(filtretSarakstu(vardi)[0] || noklusejumaObjekts)
  // funkcija, kura maina steitu, kurš nosaka  pārklājumā uzrādīto vārdu
  function atjauninatParklajumu(){
    let jaunaisAtkartojamaisVards = iegutNejausuObjektuNoSaraksta(filtretSarakstu(vardi));
    setAtkartojamoVardu(jaunaisAtkartojamaisVards ? jaunaisAtkartojamaisVards : noklusejumaObjekts);
  }

  return (
    
    <div className="App">
      <div>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossOrigin="anonymous"></link>
      </div>
      <header className="App-header">
        <div id='screenOverlay ' className={`Screen-overlay ${parklajumaRedzamiba ? '' : 'hidden'}`}>
          <form className='vw-50 vh-80 align-middle'>
            <div className='quiz-wrapper vw-50 vh-80 '>
              <div className='quiz p-1 border border-dark border-2'>
                <div>
                  <h1 className='bg-light text-dark p-1'>Vārds svešvalodā</h1>
                  <div className=' quiz-bg '>
                    <h1 className='border border-light border-2'>{valoda==='anglu' ? String(atkartojamaisVards.word) : String(atkartojamaisVards.kanji)}</h1>
                    <h1 className={`Answer ${parklajumaAtbildeRedzamiba ? '' : 'hidden'}  border border-light border-2`}>{String(atkartojamaisVards.latValTulk)}</h1>
                  </div>
                </div>
                <Button className='mb-1' variant="primary" onClick={atjauninatParklajumu}>jauns vārds</Button>{' '}
                <Button variant="light" onClick={mainitAtbildesRedzamibu}>rādīt/slēpt nozīmi</Button>{' '}
              </div>
            </div>
          </form>
        </div>
        <div className="navbar navbar-height smart-scroll fixed-top navbar-expand-lg navbar-light bg-white py-0 mdshadow-1 text-dark ">
          <button onClick={mainitParklajumaRedzamibu}>atkārtot</button>
          <h2 >Flash kāršu(Flash card) veidotājs un svešvārdu atkārtotājs</h2>
        </div>     
        <h2 className=' mt-5'>Pievieno jaunu kārti</h2>
        <form>
          <select name="Valoda" id="valoda" onChange={(e) => {
            setValoda(e.target.value);
            setJaunoVardu({ kanji: "", onyomi: "", kunyomi: "", latValTulk: "", word: "" , checked:1});
            fetchVisusVardus()
            }}>
            <option value="japanu">Japāņu</option>
            <option value="anglu">Angļu</option>
          </select>
        </form>
        {valoda === "japanu" ? (
          <form onSubmit={handleSubmit}  >
            <input 
              required
              placeholder='Vārds'
              type="text"
              className=' input_field'
              value={jaunsVards.kanji}
              onChange={(e) => {
                const updatedjaunsVards={...jaunsVards,
                  kanji:e.target.value}
                setJaunoVardu(updatedjaunsVards)
              }}
            /> 
            <br />
            <input 
              placeholder='Onyomi izrunas'
              type="text"
              className=' input_field'
              value={jaunsVards.onyomi}
              onChange={(e) => {
                const updatedjaunsVards={...jaunsVards,
                  onyomi:e.target.value}
                setJaunoVardu(updatedjaunsVards)
              }}
            /> 
            <br />
            <input 
              placeholder='Kunyomi izrunas'
              type="text"
              className=' input_field'
              value={jaunsVards.kunyomi}
              onChange={(e) => {
                const updatedjaunsVards={...jaunsVards,
                  kunyomi:e.target.value}
                setJaunoVardu(updatedjaunsVards)
              }}
            /> 
            <br />
            <input 
              required
              placeholder='Vārda nozīme latviešu valodā'
              type="text"
              className=' input_field'
              value={jaunsVards.latValTulk}
              onChange={(e) => {
                const updatedjaunsVards={...jaunsVards,
                  latValTulk:e.target.value}
                setJaunoVardu(updatedjaunsVards)
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
                placeholder="Vārds"
                type="text"
                className=' input_field'
                value={jaunsVards.word}
                onChange={(e) => {
                  const updatedjaunsVards = { ...jaunsVards, word: e.target.value };
                  setJaunoVardu(updatedjaunsVards);
                }}
              />
              <br />
              <input
                required
                placeholder="Vārda nozīme latviešu valodā"
                type="text"
                className=' input_field'
                value={jaunsVards.latValTulk}
                onChange={(e) => {
                  const updatedjaunsVards = {
                    ...jaunsVards,
                    latValTulk: e.target.value,
                  };
                  setJaunoVardu(updatedjaunsVards);
                }}
              />
              <br />
              <button type="submit">Submit</button>
            </form>
          )
        }
      <div className='grid-container'> 
        {valoda === "japanu" ? (
          vardi.map((word) => (
            <div key={word.id} className='.grid-item'>
              <div className='grid-item-wrapper-inner'>
                <div key={word.id}>
                  <h2 >{word.kanji}</h2>
                  <h3 >Onyomi:  {word.onyomi}</h3>
                  <h3 >Kunyomi:   {word.kunyomi}</h3>
                  <h3 className='nozLatVal'>Nozīme latviešu valodā:<br></br>{word.latValTulk}</h3>
                  <label>
                    <input id={word.id} type="checkbox" defaultChecked onChange={handleIzvelesRurinasMainu} />
                    Check me 
                  </label>
                  <button onClick={() => handleDzesanu(word.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
          ) : (
          vardi.map((word) => (
            <div key={word.id} className='.grid-item'>
              <div className='grid-item-wrapper-inner'>
                <div key={word.id}>
                  <h2 >{word.word}</h2>
                  <h3 className='nozLatVal'>Nozīme latviešu valodā:<br></br>{word.latValTulk}</h3>
                  <label>
                    <input id={word.id} type="checkbox" defaultChecked onChange={handleIzvelesRurinasMainu} />
                    Check me
                  </label>
                  <button onClick={() => handleDzesanu(word.id)}>Dzēst</button>   
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