import { FlatList } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import { Provider } from './index';

interface ProviderContainerProps {
  $selected: boolean;
}

interface ProviderNameProps {
  $selected: boolean;
}

interface HourProps {
  $available: boolean;
  $selected: boolean;
}

interface HourTextProps {
  $selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;
  background: #28262e;

  flex-direction: row;

  justify-content: space-between;
  align-items: center;
`;

export const ButtonBack = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
`;

export const UserIcon = styled(Icon)`
  border-radius: 28px;

  background: #999591;
  color: #3E3B47;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(FlatList<Provider>)`
  padding: 32px 24px;
`;

export const ProviderContainer = styled.TouchableOpacity<ProviderContainerProps>`
  background: ${props => props.$selected ? '#ff9000' : '#3E3B47'};
  flex-direction: row;
  align-items: center;

  padding: 8px 12px;
  margin-right: 16px;
  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderIcon = styled(Icon)`
  border-radius: 16px;
  padding: 2px;

  background: #999591;
  color: #3E3B47;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
  color: ${props => props.$selected ? '#232129' : '#F4EDE8'};
  font-family: 'RobotoSlab-Medium';
  font-size: 14px;
  margin-left: 8px;
`;

export const Calendar = styled.View`
  margin: 0 24px;
`;

export const Title = styled.Text`
  color: #f4ede8;
  font-size: 24px;
  font-family: 'RobotoSlab-Medium';
  margin-bottom: 24px;
`;

export const SelectedDateText = styled.Text`
  color: #999591;
  font-size: 14px;
  font-family: 'RobotoSlab-Regular';
  line-height: 18px;
  margin-bottom: 8px;
`;

export const Schedule = styled.View`
  margin: 24px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  color: #999591;
  font-size: 16px;
  font-family: 'RobotoSlab-Medium';
  margin-bottom: 12px;
`;

export const SectionContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Hour = styled.TouchableOpacity<HourProps>`
  background: ${props => props.$selected ? '#ff9000' : '#3E3B47'};
  padding: 12px;
  border-radius: 10px;
  margin: 0 8px 8px 0;

  opacity: ${props => props.$available ? 1 : 0.3};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${props => props.$selected ? '#232129' : '#F4EDE8'};
  font-size: 14px;
  font-family: 'RobotoSlab-Regular';
`;
