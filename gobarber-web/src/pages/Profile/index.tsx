import React, { type ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { type FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Header,
  HeaderContent,
  Content,
  AvatarInput,
} from './styles';
import { FaCircleUser } from 'react-icons/fa6';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          oldPassword: Yup.string(),
          password: Yup.string()
            .min(6, 'No mínimo 6 dígitos')
            .nullable()
            .transform(valor => (valor === '' ? null : valor))
            .when('oldPassword', {
              is: '',
              otherwise: schema => schema.required('Nova senha obrigatória'),
            }),
          passwordConfirmation: Yup.string()
            .when('password', {
              is: null,
              otherwise: schema =>
                schema.required('Confirmação de senha obrigatória'),
            })
            .oneOf([Yup.ref('password'), ''], 'Confirmação de senha incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, oldPassword, password, passwordConfirmation } =
          data;

        const formData = Object.assign(
          {
            name,
            email,
          },
          data.oldPassword && {
            oldPassword,
            password,
            passwordConfirmation,
          },
        );

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        navigate('/dashboard');

        addToast({
          type: 'success',
          title: 'Perfil atualizado',
          description:
            'Suas informações do perfil foram atualizas com sucesso!',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description: 'Ocorreu um erro ao atualizar perfil, tente novamente.',
        });
      }
    },
    [navigate, addToast, updateUser],
  );

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData();

        data.append('avatar', event.target.files[0]);

        api
          .patch('/users/avatar', data)
          .then(response => {
            updateUser(response.data);

            addToast({
              type: 'success',
              title: 'Avatar atualizado!',
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </HeaderContent>
      </Header>

      <Content>
        <AvatarInput>
          {user.avatarURL ? (
            <img src={user.avatarURL} alt={user.name} />
          ) : (
            <FaCircleUser size={186} color="#999591" />
          )}

          <label htmlFor="avatar">
            <FiCamera />

            <input type="file" id="avatar" onChange={handleAvatarChange} />
          </label>
        </AvatarInput>

        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: '24px' }}
            name="oldPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="passwordConfirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
