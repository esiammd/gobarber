import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../../pages/SignUp';
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

describe('SignUp page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const apiResponse = {
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    };

    apiMock.onPost('/users').reply(200, apiResponse);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(async () => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display success if to sign up', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const apiResponse = {
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    };

    apiMock.onPost('/users').reply(200, apiResponse);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          title: 'Cadastrado realizado!',
        }),
      );
    });
  });

  it('should not be able to sign up with invalid data', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    apiMock.onPost('/users').reply(400);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '12345' } });

    fireEvent.click(buttonElement);

    await waitFor(async () => {
      expect(mockedNavigate).not.toHaveBeenCalledWith('/');
    });
  });

  it('should display error if to sign up fails', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    apiMock.onPost('/users').reply(400);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Cadastrar');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          title: 'Erro no cadastro',
        }),
      );
    });
  });
});
