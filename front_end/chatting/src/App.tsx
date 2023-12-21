import './App.scss';
import LoginPage from './pages/LoginPage';
import ContentsPage from './pages/ContentsPage';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LoginPage></LoginPage>}></Route>
        <Route path='/Main/' element={<ContentsPage/>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
