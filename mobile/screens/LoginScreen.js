import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../services/api.services";


export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    try {
      const response = await api.post("/login", {
        username,
        senha,
      });

      const token = response.data.token;

      navigation.navigate("Movimentacao", { token });

    } catch (error) {
      Alert.alert("Erro", "Falha no login");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="CPF"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});