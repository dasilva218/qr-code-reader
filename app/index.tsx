import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Nous avons besoin de votre autorisation pour utiliser la caméra</Text>
        <Button onPress={requestPermission} title="Accorder l'autorisation" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCamera() {
    setIsCameraActive(current => !current);
    if (scanned) {
      setScanned(false);
    }
  }

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    setScanned(true);
    setScannedData(data);
    Alert.alert('QR Code Scanné', `Type: ${type}\nDonnées: ${data}`);
  };

  return (
    <View style={styles.container}>
      {isCameraActive ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Tourner la Caméra</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.cameraOffContainer}>
          <Text style={styles.cameraOffText}>La caméra est arrêtée</Text>
        </View>
      )}
      <View style={styles.controlContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
          <Text style={styles.controlButtonText}>
            {isCameraActive ? 'Arrêter la Caméra' : 'Démarrer la Caméra'}
          </Text>
        </TouchableOpacity>
        {scanned && (
          <View style={styles.scannedDataContainer}>
            <Text style={styles.scannedDataText}>Données scannées : {scannedData}</Text>
            <Button title={'Scanner à nouveau'} onPress={() => setScanned(false)} />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  controlContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scannedDataContainer: {
    alignItems: 'center',
  },
  scannedDataText: {
    fontSize: 16,
    marginBottom: 10,
  },
  cameraOffContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cameraOffText: {
    fontSize: 18,
    color: '#333',
  },
})