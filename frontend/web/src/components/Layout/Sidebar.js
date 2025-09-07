import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiHome, 
  FiScissors, 
  FiUsers, 
  FiCalendar, 
  FiStar, 
  FiUser, 
  FiSettings,
  FiX
} from 'react-icons/fi';

const SidebarContainer = styled.aside`
  height: 100%;
  padding: var(--spacing-lg);
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background-color: transparent;
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: var(--bg-tertiary);
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const NavSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-md);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: var(--spacing-xs);
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-weight: 500;
  
  &:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  &.active {
    background-color: var(--primary);
    color: white;
  }
`;

const NavIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
`;

const UserInfo = styled.div`
  padding: var(--spacing-md);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
`;

const UserName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`;

const UserRole = styled.p`
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: capitalize;
`;

const Sidebar = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const publicNavItems = [
    { path: '/', icon: FiHome, label: t('navigation.home') },
    { path: '/services', icon: FiScissors, label: t('navigation.services') },
    { path: '/barbers', icon: FiUsers, label: t('navigation.barbers') },
    { path: '/reviews', icon: FiStar, label: t('navigation.reviews') },
  ];

  const protectedNavItems = [
    { path: '/appointments', icon: FiCalendar, label: t('navigation.appointments') },
    { path: '/profile', icon: FiUser, label: t('navigation.profile') },
    { path: '/settings', icon: FiSettings, label: t('navigation.settings') },
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <h2>Menu</h2>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
      </SidebarHeader>

      {isAuthenticated && user && (
        <UserInfo>
          <UserName>{user.firstName} {user.lastName}</UserName>
          <UserRole>{user.role}</UserRole>
        </UserInfo>
      )}

      <NavSection>
        <SectionTitle>Main</SectionTitle>
        <NavList>
          {publicNavItems.map((item) => (
            <NavItem key={item.path}>
              <NavLink 
                to={item.path} 
                className={isActive(item.path) ? 'active' : ''}
                onClick={onClose}
              >
                <NavIcon>
                  <item.icon />
                </NavIcon>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
        </NavList>
      </NavSection>

      {isAuthenticated && (
        <NavSection>
          <SectionTitle>Account</SectionTitle>
          <NavList>
            {protectedNavItems.map((item) => (
              <NavItem key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  onClick={onClose}
                >
                  <NavIcon>
                    <item.icon />
                  </NavIcon>
                  {item.label}
                </NavLink>
              </NavItem>
            ))}
          </NavList>
        </NavSection>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
