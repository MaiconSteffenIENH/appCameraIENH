import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Botao({
  texto,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
  estilo,
}) {
  const estiloVariante = styles[variante] || styles.primario;
  const inativo = desabilitado || carregando;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={inativo ? undefined : onPress}
      style={[
        styles.base,
        estiloVariante,
        inativo && styles.inativo,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.texto}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primario: {
    backgroundColor: "#ff5a5f",
  },
  secundario: {
    backgroundColor: "#333",
  },
  perigo: {
    backgroundColor: "#9b1c1c",
  },
  inativo: {
    opacity: 0.55,
  },
  texto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
