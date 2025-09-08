import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/UI';
import { 
  FiScissors, 
  FiUsers, 
  FiStar, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiAward,
  FiHeart,
  FiShield
} from 'react-icons/fi';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-900) 50%, var(--accent) 100%);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-2xl);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-2xl);
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--spacing-xl);
`;

const HeroButton = styled(Button)`
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const FeaturesSection = styled.section`
  margin-bottom: var(--spacing-2xl);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
`;

const FeatureCard = styled.div`
  position: relative;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
    transform: scaleX(0);
    transition: transform var(--transition-normal);
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-100);
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const FeatureIcon = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: 2.5rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    border-radius: var(--radius-xl);
    z-index: -1;
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  ${FeatureCard}:hover &::after {
    opacity: 1;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  text-align: center;
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  text-align: center;
  font-size: 1.125rem;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-2xl);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%233b82f6" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    opacity: 0.5;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  text-align: center;
  position: relative;
  z-index: 2;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: var(--shadow-lg);
  }
`;

const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 1.25rem;
  color: var(--text-secondary);
  font-weight: 600;
`;

const CtaSection = styled.section`
  text-align: center;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-900) 100%);
  border-radius: var(--radius-xl);
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.3"/><circle cx="10" cy="10" r="0.5" fill="white" opacity="0.2"/><circle cx="40" cy="40" r="0.5" fill="white" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
    opacity: 0.4;
  }
`;

const CtaContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  color: white;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CtaText = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Premium Barbershop Experience</HeroTitle>
          <HeroSubtitle>
            Transform your style with our expert barbers and premium grooming services. 
            Book your appointment today and discover the difference professional care makes.
          </HeroSubtitle>
          <HeroButtons>
            <HeroButton variant="primary" size="lg" to="/services">
              <FiScissors />
              Explore Services
              <FiArrowRight />
            </HeroButton>
            {isAuthenticated ? (
              <HeroButton variant="outline" size="lg" to="/appointments">
                <FiCalendar />
                Book Now
                <FiArrowRight />
              </HeroButton>
            ) : (
              <HeroButton variant="outline" size="lg" to="/register">
                Get Started
                <FiArrowRight />
              </HeroButton>
            )}
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Our Barbershop?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiAward />
            </FeatureIcon>
            <FeatureTitle>Expert Barbers</FeatureTitle>
            <FeatureDescription>
              Our certified professionals bring years of experience and master the latest cutting-edge techniques to deliver exceptional results every time.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiClock />
            </FeatureIcon>
            <FeatureTitle>Flexible Scheduling</FeatureTitle>
            <FeatureDescription>
              Book appointments 24/7 with our intuitive online system. We offer extended hours to fit your busy lifestyle perfectly.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiShield />
            </FeatureIcon>
            <FeatureTitle>Premium Quality</FeatureTitle>
            <FeatureDescription>
              We use only the finest products and maintain the highest standards of hygiene and safety for your complete peace of mind.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiHeart />
            </FeatureIcon>
            <FeatureTitle>Personalized Care</FeatureTitle>
            <FeatureDescription>
              Every service is tailored to your unique style and preferences, ensuring you leave looking and feeling your absolute best.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          <StatItem>
            <StatNumber>2,500+</StatNumber>
            <StatLabel>Happy Customers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>25+</StatNumber>
            <StatLabel>Expert Barbers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>Premium Services</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>4.9★</StatNumber>
            <StatLabel>Average Rating</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <CtaSection>
        <CtaContent>
          <CtaTitle>Ready to Transform Your Style?</CtaTitle>
          <CtaText>
            Join thousands of satisfied customers who trust us with their grooming needs. 
            Book your appointment today and experience the premium difference.
          </CtaText>
          <HeroButtons>
            <HeroButton variant="primary" size="lg" to="/barbers">
              <FiUsers />
              Meet Our Barbers
              <FiArrowRight />
            </HeroButton>
            <HeroButton variant="outline" size="lg" to="/reviews">
              <FiStar />
              Read Reviews
              <FiArrowRight />
            </HeroButton>
          </HeroButtons>
        </CtaContent>
      </CtaSection>
    </HomeContainer>
  );
};

export default Home;
