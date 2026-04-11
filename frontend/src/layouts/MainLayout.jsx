import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiHome, FiGrid, FiClock } from 'react-icons/fi';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
  
    if (confirmLogout) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <span className="brand-icon">🍽️</span>
            <span className="brand-text">FoodApp</span>
          </Link>

          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}><FiHome /> Home</Link>
            <Link to="/menu" onClick={() => setMenuOpen(false)}><FiGrid /> Menu</Link>
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)}><FiClock /> My Orders</Link>}
            {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          </div>

          <div className="nav-actions">
            <Link to="/cart" className="cart-btn">
              <FiShoppingCart />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>

            {user ? (
              <div className="user-menu">
                <button className="user-btn"><FiUser /> {user.name}</button>
                <div className="user-dropdown">
                  <Link to="/orders">My Orders</Link>
                  <button onClick={handleLogout}><FiLogOut /> Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}

            <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="brand-icon">🍽️</span>
            <span>FoodApp</span>
          </div>
          <p>&copy; 2026 FoodApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
