import { registerRootComponent } from 'expo'; // 1. IMPORTANTE: Adicione esta linha
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./mobile/screens/LoginScreen";
import MovimentacaoScreen from "./mobile/screens/MovimentacaoScreen";
import ScannerScreen from "./mobile/screens/ScannerScreen";

const Stack = createNativeStackNavigator();

if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    console.log("ERRO DO CELULAR:", ...args);
    originalConsoleError(...args);
  };
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Movimentacao" component={MovimentacaoScreen} />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 2. IMPORTANTE: Registre o componente aqui no final
registerRootComponent(App);