import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Button from '../../components/Button';

import { Container, Title, Description } from './styles';

type RouteParams = {
  providerName: string;
  date: Date;
}

type RootStackParamList = {
  Dashboard: undefined;
};

const AppointmentCreated: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const { reset } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleOkPressed = useCallback(() => {
    reset({
      routes: [
        { name: 'Dashboard' },
      ],
      index: 0,
    });
  }, [reset]);

  const appointment = useMemo(() => {
    const dateFormatted = format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h com'", {
      locale: ptBR,
    });

    const dateFormattedWithFirstCharUpperCase =
      dateFormatted.charAt(0).toUpperCase() + dateFormatted.substring(1);

    return `${dateFormattedWithFirstCharUpperCase} ${routeParams.providerName}`
  }, [routeParams]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04D361" />
      <Title>Agendamento Concluído</Title>
      <Description>{appointment}</Description>

      <Button onPress={handleOkPressed} style={{width: 100}}>
        Ok
      </Button>
    </Container>
  );
};

export default AppointmentCreated;
