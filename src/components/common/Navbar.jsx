import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          <h1>EMS</h1>
          <span>Employee Management System</span>
        </NavLink>
      </div>
      <ul className="navbar-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            대시보드
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees" className={({ isActive }) => isActive ? 'active' : ''}>
            직원 관리
          </NavLink>
        </li>
        <li>
          <NavLink to="/departments" className={({ isActive }) => isActive ? 'active' : ''}>
            부서 관리
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
