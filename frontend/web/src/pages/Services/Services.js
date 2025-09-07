import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { FiScissors, FiClock, FiDollarSign, FiStar, FiFilter } from 'react-icons/fi';
import api from '../../utils/api';

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const FiltersSection = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: ${props => props.active ? 'var(--primary)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : 'var(--bg-tertiary)'};
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
`;

const ServiceCard = styled.div`
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const ServiceImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const ServiceContent = styled.div`
  padding: var(--spacing-lg);
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const ServiceTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ServicePrice = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--primary);
  font-weight: 600;
  font-size: 1.125rem;
`;

const ServiceDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
`;

const ServiceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const ServiceDuration = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const ServiceRating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

const ServiceActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--primary)'};
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'var(--primary)'};
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-2xl);
  font-size: 1.125rem;
  color: var(--text-secondary);
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--danger);
  font-size: 1.125rem;
`;

const Services = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data for services
  const mockServices = [
    {
      id: 1,
      name: 'Classic Haircut',
      description: 'Professional haircut with styling and finishing touches. Perfect for any occasion.',
      category: 'haircut',
      duration: 30,
      price: 25,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 120,
      image: 'haircut'
    },
    {
      id: 2,
      name: 'Beard Trim & Style',
      description: 'Expert beard trimming and styling to enhance your facial features.',
      category: 'beard',
      duration: 20,
      price: 15,
      currency: 'USD',
      rating: 4.9,
      reviewCount: 85,
      image: 'beard'
    },
    {
      id: 3,
      name: 'Hair Wash & Style',
      description: 'Complete hair wash with premium products and professional styling.',
      category: 'styling',
      duration: 45,
      price: 35,
      currency: 'USD',
      rating: 4.7,
      reviewCount: 95,
      image: 'styling'
    },
    {
      id: 4,
      name: 'Hair Coloring',
      description: 'Professional hair coloring service with high-quality products and expert techniques.',
      category: 'coloring',
      duration: 90,
      price: 80,
      currency: 'USD',
      rating: 4.6,
      reviewCount: 45,
      image: 'coloring'
    },
    {
      id: 5,
      name: 'Mustache Trim',
      description: 'Precise mustache trimming and styling for a clean, professional look.',
      category: 'mustache',
      duration: 15,
      price: 10,
      currency: 'USD',
      rating: 4.8,
      reviewCount: 60,
      image: 'mustache'
    },
    {
      id: 6,
      name: 'Premium Shampoo',
      description: 'Luxury shampoo treatment with deep conditioning and scalp massage.',
      category: 'shampoo',
      duration: 25,
      price: 20,
      currency: 'USD',
      rating: 4.5,
      reviewCount: 70,
      image: 'shampoo'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', icon: FiFilter },
    { id: 'haircut', name: 'Haircut', icon: FiScissors },
    { id: 'beard', name: 'Beard', icon: FiScissors },
    { id: 'styling', name: 'Styling', icon: FiScissors },
    { id: 'coloring', name: 'Coloring', icon: FiScissors },
    { id: 'mustache', name: 'Mustache', icon: FiScissors },
    { id: 'shampoo', name: 'Shampoo', icon: FiScissors }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? mockServices 
    : mockServices.filter(service => service.category === selectedCategory);

  const getServiceIcon = (category) => {
    switch (category) {
      case 'haircut': return '✂️';
      case 'beard': return '🧔';
      case 'styling': return '💇';
      case 'coloring': return '🎨';
      case 'mustache': return '👨';
      case 'shampoo': return '🧴';
      default: return '✂️';
    }
  };

  return (
    <ServicesContainer>
      <PageHeader>
        <PageTitle>{t('services.title')}</PageTitle>
        <PageSubtitle>
          Discover our range of professional grooming services designed to give you the perfect look.
        </PageSubtitle>
      </PageHeader>

      <FiltersSection>
        {categories.map(category => (
          <FilterButton
            key={category.id}
            active={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            <category.icon />
            {category.name}
          </FilterButton>
        ))}
      </FiltersSection>

      <ServicesGrid>
        {filteredServices.map(service => (
          <ServiceCard key={service.id}>
            <ServiceImage>
              {getServiceIcon(service.category)}
            </ServiceImage>
            <ServiceContent>
              <ServiceHeader>
                <ServiceTitle>{service.name}</ServiceTitle>
                <ServicePrice>
                  <FiDollarSign />
                  {service.price}
                </ServicePrice>
              </ServiceHeader>
              
              <ServiceDescription>
                {service.description}
              </ServiceDescription>
              
              <ServiceDetails>
                <ServiceDuration>
                  <FiClock />
                  {service.duration} min
                </ServiceDuration>
                <ServiceRating>
                  <FiStar />
                  {service.rating} ({service.reviewCount} reviews)
                </ServiceRating>
              </ServiceDetails>
              
              <ServiceActions>
                <ActionButton to={`/services/${service.id}`}>
                  View Details
                </ActionButton>
                <ActionButton primary to="/appointments/book">
                  Book Now
                </ActionButton>
              </ServiceActions>
            </ServiceContent>
          </ServiceCard>
        ))}
      </ServicesGrid>
    </ServicesContainer>
  );
};

export default Services;