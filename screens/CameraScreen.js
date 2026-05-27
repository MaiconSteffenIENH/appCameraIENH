import { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

import Botao from "../components/Botao";
import { carregarHistorico } from "../services/historyStorage";

export default function CameraScreen({ navigation }) {
  const cameraRef = useRef();
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [lente, setLente] = useState("back");
  const [ultimaMiniatura, setUltimaMiniatura] = useState(null);
  const [capturando, setCapturando] = useState(false);

  useEffect(() => {
    if (!permissao || !permissao.granted) {
      pedirPermissao();
    }
  }, [permissao]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        const lista = await carregarHistorico();
        if (ativo) {
          setUltimaMiniatura(lista?.[0]?.uriResultado || lista?.[0]?.uriOriginal || null);
        }
      })();
      return () => {
        ativo = false;
      };
    }, [])
  );

  function alternarLente() {
    setLente((atual) => (atual === "back" ? "front" : "back"));
  }

  async function tirarFoto() {
    const camera = cameraRef.current;
    if (!camera) return;
    try {
      setCapturando(true);
      const foto = await camera.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      navigation.navigate("Preview", { uriOriginal: foto.uri });
    } catch (erro) {
      console.warn("Erro ao tirar foto:", erro);
    } finally {
      setCapturando(false);
    }
  }

  if (!permissao) {
    return <View style={styles.container} />;
  }

  if (!permissao.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.aviso}>
          Precisamos da sua permissão para acessar a câmera.
        </Text>
        <Botao texto="Conceder acesso" onPress={pedirPermissao} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={lente}
      />

      <View style={styles.barraSuperior}>
        <TouchableOpacity
          style={styles.iconeRedondo}
          onPress={() => navigation.navigate("Gallery")}
        >
          <AntDesign name="picture" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.barraInferior}>
        <TouchableOpacity
          style={styles.miniatura}
          onPress={() => navigation.navigate("Gallery")}
        >
          {ultimaMiniatura ? (
            <Image source={{ uri: ultimaMiniatura }} style={styles.miniaturaImg} />
          ) : (
            <AntDesign name="picture" size={22} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.obturador, capturando && styles.obturadorAtivo]}
          onPress={tirarFoto}
          disabled={capturando}
        >
          <View style={styles.miolo} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconeRedondo} onPress={alternarLente}>
          <AntDesign name="sync" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  aviso: {
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 16,
    fontSize: 15,
  },
  barraSuperior: {
    position: "absolute",
    top: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
  },
  barraInferior: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 28,
  },
  iconeRedondo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  obturador: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 5,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  obturadorAtivo: {
    opacity: 0.5,
  },
  miolo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ff5a5f",
  },
  miniatura: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  miniaturaImg: {
    width: "100%",
    height: "100%",
  },
});
