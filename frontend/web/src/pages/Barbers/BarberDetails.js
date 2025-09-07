import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const BarberDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
  color: var(--text-primary);
  text-align: center;
`;

const ComingSoon = styled.div`
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
`;

const ComingSoonTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
`;

const ComingSoonText = styled.p`
  font-size: 1.125rem;
  color: var(--text-secondary);
  line-height: 1.6;
`;

const BarberDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <BarberDetailsContainer>
      <PageTitle>Barber Profile</PageTitle>
      <ComingSoon>
        <ComingSoonTitle>Barber Profile Coming Soon</ComingSoonTitle>
        <ComingSoonText>
          We're working on detailed barber profiles with portfolios, reviews, and booking options. 
          Barber ID: {id}
        </ComingSoonText>
      </ComingSoon>
    </BarberDetailsContainer>
  );
};

export default BarberDetails;
