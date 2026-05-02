import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Assistant from './pages/Assistant';
import Quiz from './pages/Quiz';
import Glossary from './pages/Glossary';
import Scenarios from './pages/Scenarios';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/scenarios" element={<Scenarios />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
