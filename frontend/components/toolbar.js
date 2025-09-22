import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Toolbar({ isAuthenticated, setIsAuthenticated }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('access_token');
    
    // Update auth state
    setIsAuthenticated(false);
    
    // Dispatch custom event
    window.dispatchEvent(new Event('authChange'));
    
    // Close mobile menu if open
    setIsMenuOpen(false);
    
    // Redirect to login
    router.push('/login');
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMenuOpen(false); // Close mobile menu
  };

  return (
    <nav className="toolbar">
      <div className="toolbar-content">
        <div className="logo">
          <h1 onClick={() => handleNavigation('/')}>PDF Tools</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-items desktop-nav">
          <button 
            onClick={() => handleNavigation('/')}
            className={router.pathname === '/' ? 'nav-btn active' : 'nav-btn'}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation('/tools')}
            className={router.pathname === '/tools' ? 'nav-btn active' : 'nav-btn'}
          >
            Tools
          </button>
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className={router.pathname === '/dashboard' ? 'nav-btn active' : 'nav-btn'}
          >
            Dashboard
          </button>
        </div>
        
        {/* Desktop User Actions */}
        <div className="user-actions desktop-nav">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <button 
            onClick={() => handleNavigation('/')}
            className={router.pathname === '/' ? 'mobile-nav-btn active' : 'mobile-nav-btn'}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation('/tools')}
            className={router.pathname === '/tools' ? 'mobile-nav-btn active' : 'mobile-nav-btn'}
          >
            Tools
          </button>
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className={router.pathname === '/dashboard' ? 'mobile-nav-btn active' : 'mobile-nav-btn'}
          >
            Dashboard
          </button>
          <button onClick={handleLogout} className="mobile-logout-btn">
            Logout
          </button>
        </div>
      )}
      
      <style jsx>{`
        .toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-bottom: 2px solid #e5e5e5;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          height: 70px;
        }
        
        .toolbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .logo h1 {
          margin: 0;
          color: #333;
          font-size: 1.8rem;
          cursor: pointer;
          transition: color 0.3s ease;
          font-weight: 700;
        }
        
        .logo h1:hover {
          color: #000;
        }
        
        .nav-items {
          display: flex;
          gap: 0.5rem;
        }
        
        .nav-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          border-radius: 10px;
          color: #666;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .nav-btn:hover {
          background: #f8f8f8;
          color: #333;
          transform: translateY(-1px);
        }
        
        .nav-btn.active {
          background: linear-gradient(135deg, #000000, #333333);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .logout-btn {
          background: linear-gradient(135deg, #000000, #333333);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .logout-btn:hover {
          background: linear-gradient(135deg, #333333, #000000);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        /* Mobile Menu Styles */
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          gap: 4px;
        }

        .mobile-menu-btn span {
          width: 25px;
          height: 3px;
          background: #333;
          border-radius: 2px;
          transition: 0.3s;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 2px solid #e5e5e5;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          gap: 0.5rem;
          flex-direction: column;
        }

        .mobile-nav-btn,
        .mobile-logout-btn {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          text-align: left;
        }

        .mobile-nav-btn {
          background: #f8f8f8;
          color: #666;
        }

        .mobile-nav-btn:hover {
          background: #e5e5e5;
          color: #333;
        }

        .mobile-nav-btn.active {
          background: linear-gradient(135deg, #000000, #333333);
          color: white;
        }

        .mobile-logout-btn {
          background: linear-gradient(135deg, #000000, #333333);
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.5rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .toolbar {
            height: 60px;
          }
          
          .toolbar-content {
            padding: 0 1rem;
          }
          
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: flex;
          }
          
          .mobile-menu {
            display: flex;
          }
          
          .logo h1 {
            font-size: 1.5rem;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}