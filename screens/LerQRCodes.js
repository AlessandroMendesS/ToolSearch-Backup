import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import supabase from '../api/supabaseClient';

export default function LerQRCodes() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidAlertShown, setInvalidAlertShown] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setScanned(false);
      setInvalidAlertShown(false);
    }
  }, [isFocused]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setLoading(true);
    try {
      // Aceita formato tool-{patrimonio}-{timestamp}
      const match = data.match(/^tool-(\w+)-\d+$/);
      if (!match) {
        if (!invalidAlertShown) {
          setInvalidAlertShown(true);
          Alert.alert('QR Code inválido', 'O QR Code não está no formato esperado.');
        }
        setLoading(false);
        return;
      }
      setInvalidAlertShown(false);
      const patrimonio = match[1];
      // Buscar dados da ferramenta no Supabase pelo patrimonio
      const { data: ferramenta, error } = await supabase
        .from('ferramentas')
        .select('*')
        .eq('patrimonio', patrimonio)
        .single();
      if (error || !ferramenta) {
        Alert.alert('Erro', 'Ferramenta não encontrada.');
        setLoading(false);
        setScanned(false);
        return;
      }
      // Navegar para a tela de detalhes da ferramenta
      navigation.navigate('DetalheFerramenta', { ferramenta });
    } catch (err) {
      Alert.alert('Erro', 'Falha ao processar o QR Code.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return <View style={styles.center}><Text>Solicitando permissão da câmera...</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={50} color="#FFA500" />
        <Text style={styles.infoText}>Precisamos da sua permissão para usar a câmera.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!isFocused) {
    return <View style={styles.center}><Text>Aguardando foco na tela...</Text></View>;
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.instructionText}>Aponte para o QR Code da ferramenta</Text>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00e676" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Buscando ferramenta...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    padding: 6,
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 110,
    marginBottom: 20,
    zIndex: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#00e676',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonCancel: {
    backgroundColor: '#ff5252',
    marginTop: 10,
  },
});
