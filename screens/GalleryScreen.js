import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

import Botao from "../components/Botao";
import {
  carregarHistorico,
  removerDoHistorico,
} from "../services/historyStorage";

export default function GalleryScreen({ navigation }) {
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState("");
  const [tagAtiva, setTagAtiva] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        setCarregando(true);
        const lista = await carregarHistorico();
        if (ativo) {
          setHistorico(lista);
          setCarregando(false);
        }
      })();
      return () => {
        ativo = false;
      };
    }, [])
  );

  const tagsDisponiveis = useMemo(() => {
    const set = new Set();
    historico.forEach((item) => {
      (item.tags || []).forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, [historico]);

  const historicoFiltrado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return historico.filter((item) => {
      const tags = (item.tags || []).map((t) => t.toLowerCase());
      if (tagAtiva && !tags.includes(tagAtiva.toLowerCase())) return false;
      if (termo.length === 0) return true;
      if (tags.some((t) => t.includes(termo))) return true;
      if ((item.filtro || "").toLowerCase().includes(termo)) return true;
      return false;
    });
  }, [historico, busca, tagAtiva]);

  function abrirComparacao(entrada) {
    navigation.navigate("Compare", { entrada });
  }

  function confirmarRemocao(entrada) {
    Alert.alert(
      "Remover do histórico?",
      "Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            const novo = await removerDoHistorico(entrada.id);
            setHistorico(novo);
          },
        },
      ]
    );
  }

  function formatarData(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return "";
    }
  }

  function renderizarItem({ item }) {
    const tags = item.tags || [];
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => abrirComparacao(item)}
        onLongPress={() => confirmarRemocao(item)}
        delayLongPress={350}
      >
        <Image source={{ uri: item.uriResultado }} style={styles.cardImg} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo} numberOfLines={1}>
            {item.filtro || "Foto"}
          </Text>
          <Text style={styles.cardData}>{formatarData(item.criadoEm)}</Text>
          {tags.length > 0 && (
            <View style={styles.cardTags}>
              {tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.cardTagChip}>
                  <Text style={styles.cardTagTxt}>{tag}</Text>
                </View>
              ))}
              {tags.length > 2 && (
                <Text style={styles.cardTagExtra}>+{tags.length - 2}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  if (!carregando && historico.length === 0) {
    return (
      <View style={styles.vazio}>
        <AntDesign name="picture" size={64} color="#444" />
        <Text style={styles.vazioTitulo}>Nenhuma foto ainda</Text>
        <Text style={styles.vazioTxt}>
          Tire uma foto para começar a montar seu histórico.
        </Text>
        <Botao
          texto="Abrir câmera"
          onPress={() => navigation.navigate("Camera")}
          estilo={{ marginTop: 20, alignSelf: "stretch" }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barraBusca}>
        <AntDesign name="search1" size={16} color="#888" />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por tag ou filtro…"
          placeholderTextColor="#666"
          style={styles.inputBusca}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca("")}>
            <AntDesign name="closecircle" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {tagsDisponiveis.length > 0 && (
        <View style={styles.tagsFiltro}>
          <TouchableOpacity
            onPress={() => setTagAtiva(null)}
            style={[styles.tagFiltroChip, !tagAtiva && styles.tagFiltroChipAtivo]}
          >
            <Text style={[styles.tagFiltroTxt, !tagAtiva && styles.tagFiltroTxtAtivo]}>
              Todas
            </Text>
          </TouchableOpacity>
          {tagsDisponiveis.map((tag) => {
            const ativo = tagAtiva === tag;
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => setTagAtiva(ativo ? null : tag)}
                style={[styles.tagFiltroChip, ativo && styles.tagFiltroChipAtivo]}
              >
                <Text style={[styles.tagFiltroTxt, ativo && styles.tagFiltroTxtAtivo]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {historicoFiltrado.length === 0 ? (
        <View style={styles.semResultado}>
          <Text style={styles.semResultadoTxt}>
            Nenhuma foto encontrada para "{tagAtiva || busca}".
          </Text>
        </View>
      ) : (
        <FlatList
          data={historicoFiltrado}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderizarItem}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ padding: 12, gap: 10 }}
        />
      )}

      <Text style={styles.dica}>
        Toque para abrir · Segure para remover
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  barraBusca: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2b2b2b",
  },
  inputBusca: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    padding: 0,
  },
  tagsFiltro: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  tagFiltroChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2b2b2b",
  },
  tagFiltroChipAtivo: {
    backgroundColor: "#3a82ff",
    borderColor: "#3a82ff",
  },
  tagFiltroTxt: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "600",
  },
  tagFiltroTxtAtivo: {
    color: "#fff",
  },
  card: {
    flex: 1,
    backgroundColor: "#161616",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#222",
  },
  cardInfo: {
    padding: 10,
  },
  cardTitulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  cardData: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },
  cardTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
    alignItems: "center",
  },
  cardTagChip: {
    backgroundColor: "#1d2f47",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  cardTagTxt: {
    color: "#9cc7ff",
    fontSize: 10,
    fontWeight: "600",
  },
  cardTagExtra: {
    color: "#888",
    fontSize: 10,
  },
  vazio: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  vazioTitulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },
  vazioTxt: {
    color: "#888",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  semResultado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  semResultadoTxt: {
    color: "#888",
    textAlign: "center",
    fontSize: 14,
  },
  dica: {
    color: "#666",
    textAlign: "center",
    fontSize: 11,
    paddingBottom: 8,
  },
});
