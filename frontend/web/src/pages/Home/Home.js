import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiScissors, 
  FiUsers, 
  FiStar, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMapPin
} from 'react-icons/fi';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
`;

const HeroSection = styled.section`
  text-align: center;
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-2xl);
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: ${props => props.primary ? 'white' : 'transparent'};
  color: ${props => props.primary ? 'var(--primary)' : 'white'};
  border: 2px solid white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--bg-secondary)' : 'white'};
    color: var(--primary);
    transform: translateY(-2px);
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background-color: var(--bg-secondary);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-2xl);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  text-align: center;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: var(--spacing-sm);
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const CtaSection = styled.section`
  text-align: center;
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border-radius: var(--radius-xl);
`;

const CtaTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
`;

const CtaText = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>Welcome to Barbershop</HeroTitle>
        <HeroSubtitle>
          Professional grooming services with skilled barbers and modern facilities. 
          Book your appointment today for the best grooming experience.
        </HeroSubtitle>
        <HeroButtons>
          <Button primary to="/services">
            <FiScissors />
            View Services
          </Button>
          {isAuthenticated ? (
            <Button to="/appointments">
              <FiCalendar />
              Book Appointment
            </Button>
          ) : (
            <Button to="/register">
              Get Started
            </Button>
          )}
        </HeroButtons>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose Us?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiUsers />
            </FeatureIcon>
            <FeatureTitle>Expert Barbers</FeatureTitle>
            <FeatureDescription>
              Our professional barbers have years of experience and are skilled in the latest techniques and styles.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiClock />
            </FeatureIcon>
            <FeatureTitle>Flexible Scheduling</FeatureTitle>
            <FeatureDescription>
              Book appointments at your convenience with our easy online booking system and flexible hours.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiCheckCircle />
            </FeatureIcon>
            <FeatureTitle>Quality Service</FeatureTitle>
            <FeatureDescription>
              We use premium products and maintain the highest standards of hygiene and customer service.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <FiMapPin />
            </FeatureIcon>
            <FeatureTitle>Convenient Location</FeatureTitle>
            <FeatureDescription>
              Located in the heart of the city with easy access and parking facilities for your convenience.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <StatsSection>
        <StatsGrid>
          <StatItem>
            <StatNumber>500+</StatNumber>
            <StatLabel>Happy Customers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>15+</StatNumber>
            <StatLabel>Expert Barbers</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>Services Available</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>5★</StatNumber>
            <StatLabel>Average Rating</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <CtaSection>
        <CtaTitle>Ready to Get Started?</CtaTitle>
        <CtaText>
          Join thousands of satisfied customers who trust us with their grooming needs. 
          Book your appointment today and experience the difference.
        </CtaText>
        <HeroButtons>
          <Button primary to="/barbers">
            <FiUsers />
            Meet Our Barbers
          </Button>
          <Button to="/reviews">
            <FiStar />
            Read Reviews
          </Button>
        </HeroButtons>
      </CtaSection>
    </HomeContainer>
  );
};

export default Home;
