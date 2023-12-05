import React from 'react';
import { useTransition } from 'react-spring';

import { type ToastMessage } from '../../hooks/toast';
import Toast from './Toast';

import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransictions = useTransition(messages, {
    from: { right: '-120%', opacity: 0 },
    enter: { right: '0%', opacity: 1 },
    leave: { right: '-120%', opacity: 0 },
  });

  return (
    <Container>
      {messagesWithTransictions((style, item) => (
        <Toast style={style} message={item}></Toast>
      ))}
    </Container>
  );
};

export default ToastContainer;
