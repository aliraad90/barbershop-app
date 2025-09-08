import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition-normal);
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-light);
  max-width: ${props => {
    switch (props.size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      case 'xl': return '1200px';
      default: return '600px';
    }
  }};
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.9)'};
  transition: transform var(--transition-normal);
  position: relative;
`;

const ModalHeader = styled.div`
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--danger);
    color: white;
    border-color: var(--danger);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: var(--spacing-xl);
  max-height: 60vh;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl);
  border-top: 1px solid var(--border-light);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className 
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer size={size} isOpen={isOpen} className={className}>
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton onClick={onClose}>
                <FiX size={20} />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        
        <ModalBody>
          {children}
        </ModalBody>
        
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default Modal;
