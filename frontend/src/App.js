import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header'
import Inicio from './components/Inicio';
import Predecir from './components/Predecir';
import Metricas from './components/Metricas';
import Reentrenar from './components/Reentrenar';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/model' element={<Metricas />} />
          <Route path='/predict' element={<Predecir />} />
          <Route path='/retrain' element={<Reentrenar />} />
        </Routes>
      </BrowserRouter>
      <footer>
        <p>Realizado por: Nicolás Casas, Nicolás Rincón y Santiago Jaimes</p>
      </footer>
    </>
  );
}

export default App;