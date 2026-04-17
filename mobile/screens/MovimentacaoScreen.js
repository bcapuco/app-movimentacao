import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import api from "../services/api.services";

export default function MovimentacaoScreen({ navigation, route }) {
  const { token } = route.params;
  const [bens, setBens] = useState([]); // Lista completa do Athenas
  const [itensParaMovimentar, setItensParaMovimentar] = useState([]); // "Carrinho" de escaneados

  // 1. Carrega os bens ao abrir a tela
  async function carregarBens() {
    try {
      const response = await api.get("/bens", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBens(response.data);
    } catch (error) {
      console.error("Erro ao carregar bens:", error);
      Alert.alert("Erro", "Não foi possível carregar os bens do Athenas.");
    }
  }

  useEffect(() => {
    carregarBens();
  }, []);

  // 2. Escuta o retorno do Scanner
  useEffect(() => {
    if (route.params?.patrimonio) {
      const escaneado = route.params.patrimonio;
      
      // Procura o bem na lista carregada (comparando com o qrcode que vem do seu backend)
      const bemEncontrado = bens.find(b => b.qrcode === escaneado);

      if (bemEncontrado) {
        setItensParaMovimentar(prev => {
          if (prev.find(item => item.id === bemEncontrado.id)) return prev;
          return [...prev, bemEncontrado]; // Guardamos o objeto todo para mostrar na tela
        });
      } else {
        Alert.alert("Aviso", "Patrimônio não encontrado na lista carregada.");
      }
    }
  }, [route.params?.patrimonio]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      
      <Button
        title="Escanear Patrimônio"
        onPress={() => navigation.navigate("Scanner", { token })}
      />

      <Text style={styles.titulo}>Itens para Movimentar ({itensParaMovimentar.length})</Text>
      
      {/* Lista de itens que você JÁ ESCANEOU */}
      <View style={styles.containerItens}>
        <FlatList
          data={itensParaMovimentar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemEscaneado}>
              <Text style={{ fontWeight: 'bold' }}>QR: {item.qrcode}</Text>
              <Text>{item.especie}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Nenhum item escaneado ainda.</Text>}
        />
      </View>

      <Button 
        title="Confirmar Movimentação" 
        disabled={itensParaMovimentar.length === 0}
        onPress={() => {
            // Próximo passo: Chamar o POST /movimentacoes
            console.log("IDs para enviar:", itensParaMovimentar.map(i => i.id));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  containerItens: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10, marginBottom: 10 },
  itemEscaneado: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', backgroundColor: '#fff', marginBottom: 5 }
});