import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import Botao from "../components/Botao";

function abrirUrl(url) {
  if (!url) return;
  Linking.openURL(url).catch(() => {});
}

function encurtar(url, max = 48) {
  if (!url) return "";
  return url.length > max ? url.slice(0, max - 1) + "…" : url;
}

export default function CompareScreen({ route, navigation }) {
  const { entrada } = route.params;
  const uriResultado = entrada.cloud?.urlFiltrada || entrada.uriResultado;
  const tags = Array.isArray(entrada.tags) ? entrada.tags : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.areaImagem}>
        <Image source={{ uri: uriResultado }} style={styles.imagem} resizeMode="cover" />
        <View style={styles.legendaCanto}>
          <Text style={styles.legendaTxt}>{entrada.filtro || "Filtro"}</Text>
        </View>
      </View>

      <View style={styles.detalhes}>
        <Text style={styles.detalheTitulo}>Detalhes do upload</Text>
        <Text style={styles.detalheItem}>
          Filtro aplicado: <Text style={styles.detalheValor}>{entrada.filtro}</Text>
        </Text>
        {entrada.transformacao ? (
          <Text style={styles.detalheItem}>
            Transformação:{" "}
            <Text style={styles.detalheCodigo}>{entrada.transformacao}</Text>
          </Text>
        ) : null}
        {entrada.cloud?.bytes ? (
          <Text style={styles.detalheItem}>
            Tamanho:{" "}
            <Text style={styles.detalheValor}>
              {Math.round(entrada.cloud.bytes / 1024)} KB
            </Text>
            {entrada.cloud.width && entrada.cloud.height
              ? ` · ${entrada.cloud.width}×${entrada.cloud.height}`
              : ""}
          </Text>
        ) : null}
        {tags.length > 0 && (
          <View style={styles.tagsLinha}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipTxt}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {entrada.cloud && (
        <View style={styles.cloudCard}>
          <Text style={styles.detalheTitulo}>Hospedagem no Cloudinary</Text>

          {entrada.cloud.urlOriginal ? (
            <TouchableOpacity
              style={styles.linkLinha}
              onPress={() => abrirUrl(entrada.cloud.urlOriginal)}
            >
              <AntDesign name="cloudupload" size={16} color="#7ad7ff" />
              <View style={{ flex: 1 }}>
                <Text style={styles.linkRotulo}>URL original</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {encurtar(entrada.cloud.urlOriginal)}
                </Text>
              </View>
              <AntDesign name="export" size={16} color="#7ad7ff" />
            </TouchableOpacity>
          ) : null}

          {entrada.cloud.urlFiltrada &&
          entrada.cloud.urlFiltrada !== entrada.cloud.urlOriginal ? (
            <TouchableOpacity
              style={styles.linkLinha}
              onPress={() => abrirUrl(entrada.cloud.urlFiltrada)}
            >
              <AntDesign name="picture" size={16} color="#7ad7ff" />
              <View style={{ flex: 1 }}>
                <Text style={styles.linkRotulo}>URL com filtro</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {encurtar(entrada.cloud.urlFiltrada)}
                </Text>
              </View>
              <AntDesign name="export" size={16} color="#7ad7ff" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      <View style={styles.acoes}>
        <Botao
          texto="Tirar outra foto"
          onPress={() => navigation.navigate("Camera")}
        />
        <Botao
          texto="Ver histórico"
          variante="secundario"
          onPress={() => navigation.navigate("Gallery")}
          estilo={{ marginTop: 10 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  conteudo: {
    padding: 14,
    paddingBottom: 28,
  },
  areaImagem: {
    width: "100%",
    aspectRatio: 4 / 3,
    backgroundColor: "#222",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
  },
  imagem: {
    width: "100%",
    height: "100%",
  },
  legendaCanto: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  legendaTxt: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  detalhes: {
    backgroundColor: "#161616",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  detalheTitulo: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 6,
  },
  detalheItem: {
    color: "#aaa",
    marginTop: 2,
  },
  detalheValor: {
    color: "#fff",
    fontWeight: "600",
  },
  detalheCodigo: {
    color: "#7ad7ff",
    fontFamily: "Courier",
  },
  tagsLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  tagChip: {
    backgroundColor: "#1d2f47",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  tagChipTxt: {
    color: "#9cc7ff",
    fontSize: 12,
    fontWeight: "600",
  },
  cloudCard: {
    backgroundColor: "#0f1d28",
    borderLeftWidth: 4,
    borderLeftColor: "#7ad7ff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  linkLinha: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },
  linkRotulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  linkUrl: {
    color: "#7ad7ff",
    fontSize: 11,
    marginTop: 2,
  },
  acoes: {
    marginTop: 4,
  },
});
