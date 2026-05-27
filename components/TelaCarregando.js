import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function TelaCarregando({ mensagem }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.caixa}>
        <ActivityIndicator size="large" color="#ff5a5f" />
        <Text style={styles.titulo}>Enviando sua foto…</Text>
        <Text style={styles.subtitulo}>
          {mensagem || "Subindo a imagem para o Cloudinary. Isso leva poucos segundos."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  caixa: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: 320,
  },
  titulo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
  },
  subtitulo: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});
