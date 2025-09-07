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
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  height: 80px;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const LogoIcon = styled(FiScissors)`
  font-size: 2rem;
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
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-secondary);
    color: var(--primary);
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
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-secondary);
    color: var(--primary);
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
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-secondary);
    border-color: var(--primary);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  min-width: 200px;
  z-index: var(--z-dropdown);
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-secondary);
  }
  
  &:first-child {
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  border: none;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-secondary);
  }
  
  &:last-child {
    border-radius: 0 0 var(--radius-md) var(--radius-md);
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
