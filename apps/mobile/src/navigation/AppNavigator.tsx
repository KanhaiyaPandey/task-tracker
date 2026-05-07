import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Stack.Navigator
      initialRouteName={token ? 'Home' : 'Landing'}
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#2563EB',
        headerTitleStyle: { fontWeight: '600', color: '#111827' },
        headerShadowVisible: true,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
