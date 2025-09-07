import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  min-height: calc(100vh - 80px); // Subtract header height
`;

const SidebarWrapper = styled.aside`
  width: 250px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: transform var(--transition-normal);
  
  @media (max-width: 768px) {
    position: fixed;
    top: 80px;
    left: 0;
    height: calc(100vh - 80px);
    z-index: var(--z-sidebar);
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const PageContent = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal-backdrop);
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <Header onToggleSidebar={toggleSidebar} />
      
      <MainContent>
        <ContentWrapper>
          <SidebarWrapper isOpen={sidebarOpen}>
            <Sidebar onClose={closeSidebar} />
          </SidebarWrapper>
          
          <Overlay isOpen={sidebarOpen} onClick={closeSidebar} />
          
          <MainWrapper>
            <PageContent>
              <Outlet />
            </PageContent>
          </MainWrapper>
        </ContentWrapper>
      </MainContent>
      
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
