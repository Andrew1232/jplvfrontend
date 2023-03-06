import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // steits kur glabāsim autorus
  const [autors, setAutors] = useState([])
  // steits priekš jauna autora inputa
  const [newAuthor, setNewAuthor] = useState("")

  // funkcija lai paprasītu visus autorus no servera
  const fetchAllAutors = () => {
    axios.get('http://localhost:3004/autors').then((response) => {

      setAutors(response.data)
    });
  }

  // izskauksies vienu reizi uz komponenta ielādi
  useEffect(() => {
    fetchAllAutors()
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={(e) => {
          // noņemam lapas pārlādi uz submita
          e.preventDefault()
          
          // sūtam serverim pieprasījumu, ka jāizveido jauns autors
          axios.post('http://localhost:3004/autors', {name: newAuthor}).then(() => {
            // kad jaunais autors ir veiksmīgi sgalbāts tad paparasm no jauna visus autorus
            fetchAllAutors()

            // iztīram inputu
            setNewAuthor('')
          });

        }}>
          <input 
            required
            placeholder='Author name...'
            type="text"
            value={newAuthor}
            onChange={(e) => {
              setNewAuthor(e.target.value)
            }}
          /> 
          <br />
          <button>
            Add new author
          </button>
        </form>

        <div>
          {/* zīmējam visus autora vārdus */}
          {autors.map((autors) => (
            <h2 key={autors.id}>{autors.name}</h2>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;