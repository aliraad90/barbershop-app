import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiScissors, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const FooterLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const FooterBottom = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const Copyright = styled.p`
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const SocialLink = styled.a`
  color: var(--text-secondary);
  font-size: 1.25rem;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--primary);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing-md);
`;

const LogoIcon = styled(FiScissors)`
  font-size: 2rem;
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
