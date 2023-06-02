import './App.css';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import Users from './Users.js';
import Books from './Books.js';
import Issues from './Issues.js';

function App() {
  return (
    <BrowserRouter>
      <div className="App container">
        <h3 className="d-flex justify-content-center m-3">
          My React App
        </h3>

        <nav className="navbar navbar-expand-sm bg-light navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/users">
                Users
              </NavLink>
            </li>
            <li className="nav-item m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/books">
                Books
              </NavLink>
            </li>
            <li className="nav-item m-1">
              <NavLink className="btn btn-light btn-outline-primary" to="/issues">
                Issues
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path='/users' element={<Users />}></Route>
          <Route path='/books' element={<Books />}></Route>
          <Route path='/issues' element={<Issues />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;