import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, Text } from 'react-native-paper';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (email === 'admin' && password === '1234') {
      alert('¡Bienvenido Juandi!');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleConfirmPassword = () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
    } else {
      alert('Contraseña confirmada');
    }
  }

  return (
    <PaperProvider>
      <View className="flex-1 justify-center items-center px-6 bg-slate-100 py-10">
        <Text variant="titleLarge" className="mb-4">Iniciar Sesión</Text>
        <TextInput
          label="Usuario"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          className="w-full mb-4"
        />
        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          className="w-full mb-6"
        />
          <TextInput
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          className="w-full mb-6"
        />
          <TextInput
          label="Nombre"
          value={name}
          onChangeText={setName}
          secureTextEntry
          mode="outlined"
          className="w-full mb-6"
        />
      
        <Button mode="contained" onPress={handleLogin}>
          Entrar
        </Button>
      </View>
    </PaperProvider>
  );
}
