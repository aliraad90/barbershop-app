import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiScissors, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-top: 1px solid var(--border-light);
  margin-top: auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="footer-dots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="1" fill="%233b82f6" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23footer-dots)"/></svg>');
    opacity: 0.3;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-2xl) var(--spacing-md);
  position: relative;
  z-index: 2;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-normal);
  
  &:hover {
    background: rgba(255, 255, 255, 0.7);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
    border-radius: var(--radius-full);
  }
`;

const FooterLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm) 0;
  transition: all var(--transition-normal);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
    transition: width var(--transition-normal);
    transform: translateY(-50%);
  }
  
  &:hover {
    color: var(--primary);
    padding-left: var(--spacing-md);
    
    &::before {
      width: 20px;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
    color: var(--primary);
    transform: translateX(5px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-light);
  padding-top: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.3);
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(10px);
`;

const Copyright = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-lg);
`;

const SocialLink = styled.a`
  color: var(--text-secondary);
  font-size: 1.5rem;
  transition: all var(--transition-normal);
  padding: var(--spacing-sm);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.3);
  
  &:hover {
    color: var(--primary);
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-lg);
`;

const LogoIcon = styled(FiScissors)`
  font-size: 2.25rem;
  color: var(--primary);
  filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
`;

const Footer = () => {
  const { t } = useTranslation();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <Logo>
              <LogoIcon />
              Barbershop
            </Logo>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Professional barbershop services with skilled barbers and modern facilities. 
              Book your appointment today for the best grooming experience.
            </p>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink to="/services">{t('navigation.services')}</FooterLink>
            <FooterLink to="/barbers">{t('navigation.barbers')}</FooterLink>
            <FooterLink to="/appointments">{t('navigation.appointments')}</FooterLink>
            <FooterLink to="/reviews">{t('navigation.reviews')}</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Services</FooterTitle>
            <FooterLink to="/services?category=haircut">{t('services.haircut')}</FooterLink>
            <FooterLink to="/services?category=beard">{t('services.beard')}</FooterLink>
            <FooterLink to="/services?category=styling">{t('services.styling')}</FooterLink>
            <FooterLink to="/services?category=coloring">{t('services.coloring')}</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>Contact Info</FooterTitle>
            <ContactInfo>
              <FiMapPin />
              <span>123 Main Street, City, State 12345</span>
            </ContactInfo>
            <ContactInfo>
              <FiPhone />
              <span>+1 (555) 123-4567</span>
            </ContactInfo>
            <ContactInfo>
              <FiMail />
              <span>info@barbershop.com</span>
            </ContactInfo>
          </FooterSection>
        </FooterGrid>

        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} Barbershop App. All rights reserved.
          </Copyright>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">📘</SocialLink>
            <SocialLink href="#" aria-label="Twitter">🐦</SocialLink>
            <SocialLink href="#" aria-label="Instagram">📷</SocialLink>
            <SocialLink href="#" aria-label="LinkedIn">💼</SocialLink>
          </SocialLinks>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
