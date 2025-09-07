import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const SettingsContainer = styled.div`
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

const Settings = () => {
  const { t } = useTranslation();

  return (
    <SettingsContainer>
      <PageTitle>{t('settings.title')}</PageTitle>
      <ComingSoon>
        <ComingSoonTitle>Settings Coming Soon</ComingSoonTitle>
        <ComingSoonText>
          We're working on comprehensive settings management. 
          Check back soon to customize your app experience.
        </ComingSoonText>
      </ComingSoon>
    </SettingsContainer>
  );
};

export default Settings;
