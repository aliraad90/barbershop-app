import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const VerifyEmailContainer = styled.div`
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

const VerifyEmail = () => {
  const { t } = useTranslation();

  return (
    <VerifyEmailContainer>
      <PageTitle>Verify Email</PageTitle>
      <ComingSoon>
        <ComingSoonTitle>Email Verification Coming Soon</ComingSoonTitle>
        <ComingSoonText>
          We're working on email verification functionality. 
          Check back soon to verify your email address.
        </ComingSoonText>
      </ComingSoon>
    </VerifyEmailContainer>
  );
};

export default VerifyEmail;
