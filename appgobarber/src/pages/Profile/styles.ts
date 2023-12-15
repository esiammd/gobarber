import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${getStatusBarHeight() + 24}px;

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

export const Content = styled.View`
  margin: 24px;
`;

export const AvatarInput = styled.View`
  position: relative;
  align-items: center;
  margin: auto;
  margin-bottom: 32px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 93px;
`;

export const UserIcon = styled(Icon)`
  border-radius: 93px;

  background-color: #999591;
  color: #3E3B47;
`;

export const AvatarButton = styled.TouchableOpacity`
  position: absolute;
  width: 48px;
  height: 48px;
  background: #ff9000;
  border-radius: 24px;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;
