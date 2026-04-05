import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EstadisticasProvider } from './context/EstadisticasContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { VictimasPage } from './pages/VictimasPage'
import { ViolenciaPage } from './pages/ViolenciaPage'
import { AutoriaPage } from './pages/AutoriaPage'
import { GeografiaPage } from './pages/GeografiaPage'
import { AcercaDePage } from './pages/AcercaDePage'

function App() {
  return (
    <BrowserRouter>
      <EstadisticasProvider>
        <div className="min-h-screen bg-zinc-950 text-white">
          <Header />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/victimas"  element={<VictimasPage />} />
            <Route path="/violencia" element={<ViolenciaPage />} />
            <Route path="/autoria"   element={<AutoriaPage />} />
            <Route path="/geografia" element={<GeografiaPage />} />
            <Route path="/acerca"    element={<AcercaDePage />} />
          </Routes>
        </div>
      </EstadisticasProvider>
    </BrowserRouter>
  )
}

export default App
