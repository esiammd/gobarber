import React, { useCallback, useRef } from 'react';
import {
  View,
  Image,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.png'

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  ImageContent,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccount,
  CreateAccountText
} from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

type RootStackParamList = {
  SignUp: undefined;
};

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { singIn } = useAuth();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await singIn({
          email: data.email,
          password: data.password,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais.',
        );
      }
  }, [singIn]);

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
            <ImageContent>
              <Image source={logoImg} />
            </ImageContent>

              <Form ref={formRef} onSubmit={handleSubmit}>
                <View>
                  <Title>Faça seu login</Title>
                </View>

                <Input
                  autoCorrect={false}
                  autoCapitalize='none'
                  keyboardType='email-address'
                  name='email'
                  icon='mail'
                  placeholder='E-mail'
                  returnKeyType='next'
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                />
                <Input
                  ref={passwordInputRef}
                  name='password'
                  icon='lock'
                  placeholder='Senha'
                  secureTextEntry
                  returnKeyType='send'
                  onSubmitEditing={() => {
                    formRef.current?.submitForm();
                  }}
                />

                <Button onPress={() => {
                  formRef.current?.submitForm();
                }}>
                  Entrar
                </Button>

                <ForgotPassword onPress={() => { }}>
                  <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                </ForgotPassword>
              </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccount onPress={() => navigate('SignUp')}>
        <Icon name='log-in' size={20} color='#ff9000' />
        <CreateAccountText>Criar conta</CreateAccountText>
      </CreateAccount>
    </>
  );
};

export default SignIn;
