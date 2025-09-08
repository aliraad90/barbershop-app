import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  overflow: hidden;
  position: relative;
  
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
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-100);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  ${props => props.elevated && `
    box-shadow: var(--shadow-lg);
    
    &:hover {
      box-shadow: var(--shadow-xl);
    }
  `}
  
  ${props => props.flat && `
    box-shadow: none;
    border: 1px solid var(--border-color);
    
    &:hover {
      box-shadow: var(--shadow-md);
    }
  `}
`;

const CardHeader = styled.div`
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const CardSubtitle = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: var(--spacing-sm) 0 0;
  font-weight: 500;
`;

const CardBody = styled.div`
  padding: var(--spacing-xl);
`;

const CardFooter = styled.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl);
  border-top: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
`;

const CardImage = styled.div`
  width: 100%;
  height: ${props => props.height || '200px'};
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-quaternary) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-normal);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const CardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Card = ({ 
  children, 
  title, 
  subtitle, 
  image, 
  imageHeight, 
  badge, 
  elevated = false, 
  flat = false,
  className,
  ...props 
}) => {
  return (
    <CardContainer elevated={elevated} flat={flat} className={className} {...props}>
      {badge && <CardBadge>{badge}</CardBadge>}
      
      {(title || subtitle) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardHeader>
      )}
      
      {image && (
        <CardImage height={imageHeight}>
          <img src={image} alt={title || 'Card image'} />
        </CardImage>
      )}
      
      <CardBody>
        {children}
      </CardBody>
    </CardContainer>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Badge = CardBadge;

export default Card;
