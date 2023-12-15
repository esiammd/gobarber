import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErros';
import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Header,
  ButtonBack,
  HeaderTitle,
  Content,
  AvatarInput,
  UserAvatar,
  UserIcon,
  AvatarButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const { user, singOut, updateUser } = useAuth();
  const { goBack } = useNavigation();

  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

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

        Alert.alert(
          'Perfil atualizado',
          'Suas informações do perfil foram atualizas com sucesso!',
        );

        goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização',
          'Ocorreu um erro ao atualizar perfil, tente novamente.',
        );
      }
  }, [goBack, updateUser]);

  const handleAvatarChange = useCallback(() => {
    Alert.alert('', '', [
      {
        text: 'Escolher da galeria',
        onPress: handleImageLibrary,
      },
      {
        text: 'Tirar foto',
        onPress: handleImageCamera
      },
    ], {
      cancelable: true
    });
  }, []);

  const handleImageLibrary = useCallback(() => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    }, (response) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Erro ao atualizar seu avatar.');
        return;
      }

      let imageUri = response.assets && response.assets[0].uri;
      let imageType = response.assets && response.assets[0].type;

      const data = new FormData();
      data.append('avatar', {
        type: imageType,
        name: `${user.id}.jpg`,
        uri: imageUri,
      });

      api
        .patch('users/avatar', data, {
          headers:{
            'Content-Type':'multipart/form-data'
          }})
        .then(apiResponse => {
          updateUser(apiResponse.data);

          Alert.alert(
            'Avatar atualizado!',
          );
        })
        .catch(error => {
          console.log(error);
        });
    });
  }, [user.id, updateUser]);

  const handleImageCamera = useCallback(() => {
    launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    }, response => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Erro ao atualizar seu avatar.');
        return;
      }

      let imageUri = response.assets && response.assets[0].uri;
      let imageType = response.assets && response.assets[0].type;

      const data = new FormData();
      data.append('avatar', {
        type: imageType,
        name: `${user.id}.jpg`,
        uri: imageUri,
      });

      api
        .patch('users/avatar', data, {
          headers:{
            'Content-Type':'multipart/form-data'
          }})
        .then(apiResponse => {
          updateUser(apiResponse.data);

          Alert.alert(
            'Avatar atualizado!',
          );
        })
        .catch(error => {
          console.log(error);
        });
      });
  }, [user.id, updateUser]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps='handled'
        >
          <Container>
            <Header>
              <ButtonBack onPress={navigateBack}>
                <Icon name="arrow-left" size={24} color="#999591" />
              </ButtonBack>

              <HeaderTitle>Meu perfil</HeaderTitle>

              <ButtonBack onPress={singOut}>
                <Icon name="power" size={24} color="#999591" />
              </ButtonBack>
            </Header>

            <Content>
              <AvatarInput>
                {user.avatarURL ? (
                  <UserAvatar source={{ uri: user.avatarURL }} />
                ) : (
                  <UserIcon name="user" size={186} />
                )}

                <AvatarButton onPress={handleAvatarChange}>
                  <Icon name="camera" size={20} color="#312E38" />
                </AvatarButton>
              </AvatarInput>

              <Form
                ref={formRef}
                initialData={{
                  name: user.name,
                  email: user.email,
                }}
                onSubmit={handleSubmit}
              >
                <Input
                  autoCapitalize='words'
                  name='name'
                  icon='user'
                  placeholder='Nome'
                  returnKeyType='next'
                  onSubmitEditing={() => {
                    emailInputRef.current?.focus();
                  }}
                />
                <Input
                  ref={emailInputRef}
                  autoCorrect={false}
                  autoCapitalize='none'
                  keyboardType='email-address'
                  name='email'
                  icon='mail'
                  placeholder='E-mail'
                  returnKeyType='next'
                  onSubmitEditing={() => {
                    oldPasswordInputRef.current?.focus();
                  }}
                />

                <Input
                  containerStyle={{ marginTop: 16 }}
                  ref={oldPasswordInputRef}
                  name='oldPassword'
                  icon='lock'
                  placeholder='Senha atual'
                  secureTextEntry
                  textContentType='newPassword'
                  returnKeyType='next'
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                />
                <Input
                  ref={passwordInputRef}
                  name='password'
                  icon='lock'
                  placeholder='Nova senha'
                  secureTextEntry
                  textContentType='newPassword'
                  returnKeyType='next'
                  onSubmitEditing={() => {
                    passwordConfirmationInputRef.current?.focus();
                  }}
                />
                <Input
                  ref={passwordConfirmationInputRef}
                  name='passwordConfirmation'
                  icon='lock'
                  placeholder='Confirmar senha'
                  secureTextEntry
                  textContentType='newPassword'
                  returnKeyType='send'
                  onSubmitEditing={() => {
                    formRef.current?.submitForm();
                  }}
                />

                <Button onPress={() => {
                  formRef.current?.submitForm();
                }}>
                  Confirmar mudanças
                </Button>
              </Form>
            </Content>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
