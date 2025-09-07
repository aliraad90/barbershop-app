import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiStar, FiMapPin, FiClock, FiAward, FiFilter } from 'react-icons/fi';

const BarbersContainer = styled.div`
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

const BarbersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);
`;

const BarberCard = styled.div`
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

const BarberImage = styled.div`
  height: 250px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  position: relative;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: ${props => props.status === 'available' ? 'var(--success)' : 'var(--warning)'};
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const BarberContent = styled.div`
  padding: var(--spacing-lg);
`;

const BarberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const BarberName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const BarberRating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--warning);
  font-weight: 600;
`;

const BarberLocation = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
`;

const BarberExperience = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
`;

const BarberSpecialties = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SpecialtyTag = styled.span`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  margin-right: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
`;

const BarberActions = styled.div`
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

const Barbers = () => {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Mock data for barbers
  const mockBarbers = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      rating: 4.9,
      reviewCount: 156,
      experience: 8,
      location: 'Downtown Branch',
      specialties: ['haircut', 'beard', 'styling'],
      status: 'available',
      avatar: '👨‍💼'
    },
    {
      id: 2,
      name: 'Mohammed Ali',
      rating: 4.8,
      reviewCount: 142,
      experience: 6,
      location: 'Mall Branch',
      specialties: ['haircut', 'coloring', 'styling'],
      status: 'available',
      avatar: '👨‍🎨'
    },
    {
      id: 3,
      name: 'Omar Khalil',
      rating: 4.7,
      reviewCount: 98,
      experience: 5,
      location: 'City Center',
      specialties: ['beard', 'mustache', 'haircut'],
      status: 'busy',
      avatar: '👨‍💻'
    },
    {
      id: 4,
      name: 'Youssef Mahmoud',
      rating: 4.9,
      reviewCount: 203,
      experience: 12,
      location: 'Main Street',
      specialties: ['haircut', 'styling', 'coloring', 'beard'],
      status: 'available',
      avatar: '👨‍🎓'
    },
    {
      id: 5,
      name: 'Karim Farouk',
      rating: 4.6,
      reviewCount: 87,
      experience: 4,
      location: 'Garden District',
      specialties: ['haircut', 'shampoo', 'styling'],
      status: 'available',
      avatar: '👨‍🔬'
    },
    {
      id: 6,
      name: 'Tarek Nasser',
      rating: 4.8,
      reviewCount: 134,
      experience: 7,
      location: 'Business District',
      specialties: ['beard', 'mustache', 'haircut', 'styling'],
      status: 'busy',
      avatar: '👨‍💼'
    }
  ];

  const specialties = [
    { id: 'all', name: 'All Specialties' },
    { id: 'haircut', name: 'Haircut' },
    { id: 'beard', name: 'Beard' },
    { id: 'styling', name: 'Styling' },
    { id: 'coloring', name: 'Coloring' },
    { id: 'mustache', name: 'Mustache' },
    { id: 'shampoo', name: 'Shampoo' }
  ];

  const filteredBarbers = selectedSpecialty === 'all' 
    ? mockBarbers 
    : mockBarbers.filter(barber => barber.specialties.includes(selectedSpecialty));

  return (
    <BarbersContainer>
      <PageHeader>
        <PageTitle>{t('barbers.title')}</PageTitle>
        <PageSubtitle>
          Meet our talented team of professional barbers with years of experience and expertise.
        </PageSubtitle>
      </PageHeader>

      <FiltersSection>
        {specialties.map(specialty => (
          <FilterButton
            key={specialty.id}
            active={selectedSpecialty === specialty.id}
            onClick={() => setSelectedSpecialty(specialty.id)}
          >
            <FiFilter />
            {specialty.name}
          </FilterButton>
        ))}
      </FiltersSection>

      <BarbersGrid>
        {filteredBarbers.map(barber => (
          <BarberCard key={barber.id}>
            <BarberImage>
              {barber.avatar}
              <StatusBadge status={barber.status}>
                {barber.status === 'available' ? 'Available' : 'Busy'}
              </StatusBadge>
            </BarberImage>
            <BarberContent>
              <BarberHeader>
                <BarberName>{barber.name}</BarberName>
                <BarberRating>
                  <FiStar />
                  {barber.rating} ({barber.reviewCount})
                </BarberRating>
              </BarberHeader>
              
              <BarberLocation>
                <FiMapPin />
                {barber.location}
              </BarberLocation>
              
              <BarberExperience>
                <FiAward />
                {barber.experience} years experience
              </BarberExperience>
              
              <BarberSpecialties>
                {barber.specialties.map(specialty => (
                  <SpecialtyTag key={specialty}>
                    {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                  </SpecialtyTag>
                ))}
              </BarberSpecialties>
              
              <BarberActions>
                <ActionButton to={`/barbers/${barber.id}`}>
                  View Profile
                </ActionButton>
                <ActionButton primary to="/appointments/book">
                  Book Appointment
                </ActionButton>
              </BarberActions>
            </BarberContent>
          </BarberCard>
        ))}
      </BarbersGrid>
    </BarbersContainer>
  );
};

export default Barbers;