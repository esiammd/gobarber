import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedNavigate = jest.fn();
const mockedAddToast = jest.fn();
const mockedLocation = {
  search: '?token=token-123',
};

jest.mock('react-router-dom', () => {
  return {
    useNavigate: () => mockedNavigate,
    Link: ({ children }: { children: React.ReactNode }) => children,
    useLocation: () => mockedLocation,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ResetPassword page', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  it('should be able to reset password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    apiMock.onPost('/password/reset').reply(204);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(async () => {
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset password if password confirmation different of password', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    apiMock.onPost('/password/reset').reply(400);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonElement);

    await waitFor(async () => {
      await act(async () => {
        expect(mockedNavigate).not.toHaveBeenCalled();
      });
    });
  });

  it('should display an error if reset password fails', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    apiMock.onPost('/password/reset').reply(400);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          title: 'Erro ao resetar senha',
        }),
      );
    });
  });

  it('should display an error if token is null', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    mockedLocation.search = '?token=';

    apiMock.onPost('/password/reset').reply(400);

    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmationField = getByPlaceholderText(
      'Confirmação da senha',
    );
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '123456' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123456' },
    });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          title: 'Erro ao resetar senha',
        }),
      );
    });
  });
});
