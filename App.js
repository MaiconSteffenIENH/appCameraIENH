import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CameraScreen from "./screens/CameraScreen";
import PreviewScreen from "./screens/PreviewScreen";
import CompareScreen from "./screens/CompareScreen";
import GalleryScreen from "./screens/GalleryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Camera"
          screenOptions={{
            headerStyle: { backgroundColor: "#111" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: "#000" },
          }}
        >
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ title: "Camera Decor" }}
          />
          <Stack.Screen
            name="Preview"
            component={PreviewScreen}
            options={{ title: "Pré-visualização" }}
          />
          <Stack.Screen
            name="Compare"
            component={CompareScreen}
            options={{ title: "Resultado" }}
          />
          <Stack.Screen
            name="Gallery"
            component={GalleryScreen}
            options={{ title: "Histórico" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
