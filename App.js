import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Theme from './src/core/theme';
import { Provider } from 'react-redux';
import store from './src/redux/store';

//screens
import LoginScreen from './src/screens/login';
import HomeScreen from './src/screens/home';
import DetailScreen from './src/screens/detail';
import FilterScreen from './src/screens/filter';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <PaperProvider theme={Theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="DetailScreen" component={DetailScreen} />
            <Stack.Screen name="FilterScreen" component={FilterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  )
}

export default App;