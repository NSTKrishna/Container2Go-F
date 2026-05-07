
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import TerminalPage from './TerminalPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terminal" element={<TerminalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;