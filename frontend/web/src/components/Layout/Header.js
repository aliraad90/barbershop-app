import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FiMenu, 
  FiUser, 
  FiLogOut, 
  FiSettings, 
  FiSun, 
  FiMoon,
  FiGlobe,
  FiCalendar,
  FiScissors
} from 'react-icons/fi';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  height: 80px;
  transition: all var(--transition-normal);
  
  .dark & {
    background: rgba(15, 23, 42, 0.95);
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all var(--transition-normal);
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled(FiScissors)`
  font-size: 2.25rem;
  color: var(--primary);
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
    transition: all var(--transition-normal);
    transform: translateX(-50%);
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%);
    color: var(--primary);
    transform: translateY(-1px);
    
    &::before {
      width: 80%;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-200);
    
    &::before {
      left: 100%;
    }
  }
`;

const MobileMenuButton = styled(ActionButton)`
  @media (min-width: 769px) {
    display: none;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
    border-color: var(--primary-200);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
    
    &::before {
      left: 100%;
    }
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: var(--shadow-sm);
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  min-width: 220px;
  z-index: var(--z-dropdown);
  display: ${props => props.isOpen ? 'block' : 'none'};
  overflow: hidden;
  
  .dark & {
    background: rgba(15, 23, 42, 0.95);
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--transition-normal);
  font-weight: 500;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    transform: scaleY(0);
    transition: transform var(--transition-normal);
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%);
    color: var(--primary);
    padding-left: var(--spacing-xl);
    
    &::before {
      transform: scaleY(1);
    }
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: transparent;
  border: none;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 500;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, var(--danger) 0%, var(--danger-light) 100%);
    transform: scaleY(0);
    transition: transform var(--transition-normal);
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--danger-50) 0%, var(--bg-secondary) 100%);
    color: var(--danger);
    padding-left: var(--spacing-xl);
    
    &::before {
      transform: scaleY(1);
    }
  }
`;

const Header = ({ onToggleSidebar }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon />
          Barbershop
        </Logo>

        <Nav>
          <NavLink to="/services">{t('navigation.services')}</NavLink>
          <NavLink to="/barbers">{t('navigation.barbers')}</NavLink>
          <NavLink to="/reviews">{t('navigation.reviews')}</NavLink>
          {isAuthenticated && (
            <NavLink to="/appointments">{t('navigation.appointments')}</NavLink>
          )}
        </Nav>

        <HeaderActions>
          <ActionButton onClick={toggleLanguage} title={t('settings.language')}>
            <FiGlobe />
          </ActionButton>
          
          <ActionButton onClick={toggleTheme} title={t('settings.theme')}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </ActionButton>

          <MobileMenuButton onClick={onToggleSidebar}>
            <FiMenu />
          </MobileMenuButton>

          {isAuthenticated ? (
            <UserMenu data-user-menu>
              <UserButton onClick={handleUserMenuToggle}>
                <UserAvatar>
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </UserAvatar>
                <span>{user?.firstName}</span>
              </UserButton>
              
              <Dropdown isOpen={userMenuOpen}>
                <DropdownItem to="/profile">
                  <FiUser />
                  {t('navigation.profile')}
                </DropdownItem>
                <DropdownItem to="/appointments">
                  <FiCalendar />
                  {t('navigation.appointments')}
                </DropdownItem>
                <DropdownItem to="/settings">
                  <FiSettings />
                  {t('navigation.settings')}
                </DropdownItem>
                <DropdownButton onClick={handleLogout}>
                  <FiLogOut />
                  {t('navigation.logout')}
                </DropdownButton>
              </Dropdown>
            </UserMenu>
          ) : (
            <NavLink to="/login">{t('navigation.login')}</NavLink>
          )}
        </HeaderActions>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
