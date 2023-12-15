import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import Button from '../../components/Button';

import {
  Container,
  Header,
  ButtonBack,
  HeaderTitle,
  ProfileButton,
  UserAvatar,
  UserIcon,
  Content,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderIcon,
  ProviderName,
  Calendar,
  Title,
  SelectedDateText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
} from './styles';

type RouteParams = {
  providerId: string;
}

type RootStackParamList = {
  Profile: undefined;
  AppointmentCreated: { providerName: string, date: Date } | undefined;
};

export interface Provider {
  id: string;
  name: string;
  avatarURL: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
  hourFormatted: string;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('');
  const [availabilities, setAvailabilities] = useState<AvailabilityItem[]>([]);

  const { navigate, goBack } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const navigateToProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if(Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: string) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = format(selectedDate, `yyyy-MM-dd ${selectedHour}`);
      const provider = providers.find(provider => provider.id === selectedProvider);

      if (provider) {
        await api.post('/appointments', {
          providerId: selectedProvider,
          date,
        });

        navigate('AppointmentCreated', {
          providerName: provider.name,
          date: new Date(date),
        });
      }
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente.'
      );
    }
  }, [navigate, selectedDate, selectedHour, selectedProvider]);

  const seletedDateAsText = useMemo(() => {
    return format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const morningAvailabilities = useMemo(() => {
    return availabilities
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availabilities]);

  const afternoonAvailabilities = useMemo(() => {
    return availabilities
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availabilities]);

  useEffect(() => {
    api.get('/providers')
      .then(response => setProviders(response.data))
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    api.get(`/providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate(),
      }
    })
      .then(response => setAvailabilities(response.data))
      .catch(error => console.log(error));
  }, [selectedProvider, selectedDate]);

  return (
    <Container>
      <Header>
        <ButtonBack onPress={navigateBack}>
          <Icon name="arrow-left" size={24} color="#999591" />
        </ButtonBack>

        <HeaderTitle>Agendamento</HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          {user.avatarURL ?
            <UserAvatar source={{ uri: user.avatarURL }} />
          :
            <UserIcon name="user" size={56} />
          }
        </ProfileButton>
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                $selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                {provider.avatarURL ?
                  <ProviderAvatar source={{ uri: provider.avatarURL }} />
                :
                  <ProviderIcon name="user" size={26} />
                }

                <ProviderName $selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <SelectedDateText>{seletedDateAsText}</SelectedDateText>

          <Button onPress={handleToggleDatePicker} style={{height: 46}}>
            Selecionar outra data
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailabilities.map(({ hourFormatted, available }) => (
                <Hour
                  key={hourFormatted}
                  disabled={!available}
                  $available={available}
                  $selected={hourFormatted === selectedHour}
                  onPress={() => handleSelectHour(hourFormatted)}
                >
                  <HourText $selected={hourFormatted === selectedHour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailabilities.map(({ hourFormatted, available }) => (
                <Hour
                  key={hourFormatted}
                  disabled={!available}
                  $available={available}
                  $selected={hourFormatted === selectedHour}
                  onPress={() => handleSelectHour(hourFormatted)}
                >
                  <HourText $selected={hourFormatted === selectedHour}>
                    {hourFormatted}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Button onPress={handleCreateAppointment}>
            Agendar
          </Button>
        </Schedule>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
