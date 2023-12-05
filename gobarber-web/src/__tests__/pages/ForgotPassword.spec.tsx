import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ForgotPassword from '../../pages/ForgotPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedNavigate = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => mockedNavigate,
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to forgot password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    apiMock.onPost('/password/forgot').reply(204);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    await waitFor(async () => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display an success if to forgot password', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    apiMock.onPost('/password/forgot').reply(200);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          title: 'E-mail de recuperação enviado',
        }),
      );
    });
  });

  it('should not be able to forgot password with invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    apiMock.onPost('/password/forgot').reply(400);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });

    fireEvent.click(buttonElement);

    await waitFor(async () => {
      await act(async () => {
        expect(mockedNavigate).not.toHaveBeenCalled();
      });
    });
  });

  it('should display an error if forgot password fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

    apiMock.onPost('/password/forgot').reply(400);

    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Recuperar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          title: 'Erro na recuperação de senha',
        }),
      );
    });
  });
});
