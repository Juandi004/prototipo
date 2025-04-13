import React, { useEffect, useState } from 'react';
import { View, Button, PermissionsAndroid, Platform, Text } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import type { Device } from 'react-native-ble-plx';

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";  // Coincide con el código ESP32
const CHARACTERISTIC_UUID = "abcd1234-5678-90ab-cdef-1234567890ab";  // Coincide con el código ESP32
const manager = new BleManager();

export default function App() {
  const [device, setDevice] = useState<Device | null>(null);
  const [ledOn, setLedOn] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 31) {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
        } else {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
        }
      }
    };

    const startScan = async () => {
      await requestPermissions();

      manager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.log("Error de escaneo:", error);
          return;
        }

        if (scannedDevice?.name === 'ESP32_ACTUADOR') {
          console.log("Dispositivo encontrado:", scannedDevice.name);
          manager.stopDeviceScan();  // Detener el escaneo después de encontrar el dispositivo
          connectToDevice(scannedDevice);  // Intentar conectar
        }
      });
    };

    const connectToDevice = async (device: Device) => {
      try {
        console.log("Intentando conectar al dispositivo...");
        const connectedDevice = await device.connect();
        console.log("Conexión exitosa con", device.name);
        await connectedDevice.discoverAllServicesAndCharacteristics();
        setDevice(connectedDevice);
        console.log("Servicios y características descubiertos");
      } catch (error) {
        console.error("Error de conexión con el dispositivo:", error);
      }
    };

    startScan();

    return () => {
      manager.destroy();
    };
  }, []);

  const toggleLED = async () => {
    if (!device) return;
    const isConnected = await device.isConnected();
    if (!isConnected) {
      console.log("Dispositivo no conectado");
      return;
    }

    const newState = !ledOn;
    const command = newState ? "ON" : "OFF";

    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      Buffer.from(command).toString('base64') // Enviamos base64
    );

    setLedOn(newState);
  };

  const disconnectDevice = async () => {
    if (device) {
      console.log("Desconectando dispositivo...");
      await device.cancelConnection();
      setDevice(null);
      setLedOn(false); // Asegúrate de que el LED se apague también
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>LED del ESP32</Text>
      <Button title={ledOn ? "Desactivar LED" : "Activar LED"} onPress={toggleLED} />
      <Button title="Desconectar" onPress={disconnectDevice} />
    </View>
  );
}
