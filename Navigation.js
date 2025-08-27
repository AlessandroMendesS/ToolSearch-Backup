import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack'; // Removido
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TelaInicial from './screens/Home';
import TelaPerfil from './screens/Perfil';
import TelaLeituraCodigoBarras from './screens/TelaLeituraCodigoBarras';
import TelaPesquisarFerramentas from './screens/TelaPesquisarFerramentas';
import LerQRCodes from './screens/LerQRCodes';
// import TelaScannerEmprestimo from './screens/TelaScannerEmprestimo'; // Removido

const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator(); // Removido

export default function Tabs() { // Nome original restaurado
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: estilos.bottomBar,
      }}
    >
      <Tab.Screen
        name="Início"
        component={TelaInicial}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={26} color={focused ? "#38a169" : "#6b7280"} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={TelaPesquisarFerramentas}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={focused ? "#38a169" : "#6b7280"} />
          ),
          unmountOnBlur: true
        }}
      />
      <Tab.Screen
        name="Adicionar"
        component={TelaLeituraCodigoBarras}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={32} color={focused ? "#38a169" : "#6b7280"} />
          ),
        }}
      />
      <Tab.Screen
        name="Ler QR Code"
        component={LerQRCodes}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "qr-code" : "qr-code-outline"} size={26} color={focused ? "#38a169" : "#6b7280"} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={TelaPerfil}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={26} color={focused ? "#38a169" : "#6b7280"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator Principal removido

const estilos = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#14351c',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    paddingVertical: 5,
    zIndex: 10,
  },
});
