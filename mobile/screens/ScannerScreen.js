import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Solicita permissão se ainda não foi definida
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Exibe botão se permissão foi negada
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Precisamos de acesso à câmera</Text>
        <Button onPress={requestPermission} title="Dar Permissão" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return; // Evita múltiplas leituras
    setScanned(true);
    
    // Opcional: resetar após um tempo para poder escanear de novo, se precisar
    navigation.navigate("Movimentacao", { patrimonio: data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "code128"], // Ajuste conforme necessário
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});