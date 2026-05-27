import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import Botao from "../components/Botao";
import TelaCarregando from "../components/TelaCarregando";
import {
  cloudinaryConfigurado,
  enviarImagemParaCloudinary,
  montarUrlComTransformacao,
} from "../services/cloudinaryService";
import { adicionarAoHistorico } from "../services/historyStorage";
import { FILTROS_CLOUDINARY, TAGS_SUGERIDAS } from "../config";

export default function PreviewScreen({ route, navigation }) {
  const { uriOriginal } = route.params;
  const [filtroSelecionado, setFiltroSelecionado] = useState(FILTROS_CLOUDINARY[1]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [statusLoader, setStatusLoader] = useState("");
  const [erro, setErro] = useState(null);

  const podeEnviar = useMemo(
    () => !!uriOriginal && !enviando && cloudinaryConfigurado(),
    [uriOriginal, enviando]
  );

  function alternarTag(tag) {
    setTagsSelecionadas((atuais) =>
      atuais.includes(tag) ? atuais.filter((t) => t !== tag) : [...atuais, tag]
    );
  }

  async function aoEnviar() {
    if (!podeEnviar) return;
    setEnviando(true);
    setErro(null);

    try {
      setStatusLoader("Enviando foto para o Cloudinary…");
      const upload = await enviarImagemParaCloudinary(uriOriginal, {
        rotulo: "foto",
        tags: tagsSelecionadas,
      });

      const urlOriginalCloud = montarUrlComTransformacao(
        upload.publicId,
        upload.formato,
        ""
      );
      const urlFiltrada = montarUrlComTransformacao(
        upload.publicId,
        upload.formato,
        filtroSelecionado.transformacao
      );

      const entrada = await adicionarAoHistorico({
        uriOriginal,
        uriResultado: urlFiltrada,
        filtro: filtroSelecionado.rotulo,
        filtroId: filtroSelecionado.id,
        transformacao: filtroSelecionado.transformacao,
        tags: tagsSelecionadas,
        cloud: {
          publicId: upload.publicId,
          formato: upload.formato,
          bytes: upload.bytes,
          width: upload.width,
          height: upload.height,
          urlOriginal: urlOriginalCloud,
          urlFiltrada,
        },
      });

      navigation.replace("Compare", { entrada });
    } catch (err) {
      setErro(err.message || "Erro inesperado ao enviar a foto.");
    } finally {
      setEnviando(false);
      setStatusLoader("");
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: uriOriginal }} style={styles.imagem} />

        {!cloudinaryConfigurado() && (
          <View style={styles.avisoCaixa}>
            <AntDesign name="infocirlceo" size={16} color="#f5c518" />
            <Text style={styles.avisoTxt}>
              Cloudinary não configurado em{" "}
              <Text style={styles.codigo}>config.js</Text>. Preencha
              CLOUDINARY_CLOUD_NAME e CLOUDINARY_UPLOAD_PRESET antes de enviar.
            </Text>
          </View>
        )}

        <Text style={styles.label}>Filtro a aplicar</Text>
        <View style={styles.chipsLinha}>
          {FILTROS_CLOUDINARY.map((f) => {
            const ativo = filtroSelecionado.id === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFiltroSelecionado(f)}
                style={[styles.chip, ativo && styles.chipAtivo]}
              >
                <Text style={[styles.chipTxt, ativo && styles.chipTxtAtivo]}>
                  {f.rotulo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Tags</Text>
        <Text style={styles.sublabel}>
          Selecione tags para encontrar essa foto depois no histórico.
        </Text>
        <View style={styles.chipsLinha}>
          {TAGS_SUGERIDAS.map((tag) => {
            const ativo = tagsSelecionadas.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => alternarTag(tag)}
                style={[styles.chip, ativo && styles.chipTagAtivo]}
              >
                <Text style={[styles.chipTxt, ativo && styles.chipTxtAtivo]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {erro && (
          <View style={styles.erroCaixa}>
            <AntDesign name="exclamationcircleo" size={18} color="#fff" />
            <Text style={styles.erroTxt}>{erro}</Text>
          </View>
        )}

        <Botao
          texto="Enviar para o Cloudinary"
          onPress={aoEnviar}
          carregando={enviando}
          desabilitado={!podeEnviar}
          estilo={{ marginTop: 18 }}
        />
        <Botao
          texto="Cancelar"
          variante="secundario"
          onPress={() => navigation.goBack()}
          estilo={{ marginTop: 10, marginBottom: 30 }}
        />
      </ScrollView>

      {enviando && <TelaCarregando mensagem={statusLoader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  scroll: {
    padding: 18,
    paddingBottom: 40,
  },
  imagem: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 14,
    backgroundColor: "#222",
    marginBottom: 18,
  },
  avisoCaixa: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#2a2410",
    borderLeftWidth: 4,
    borderLeftColor: "#f5c518",
    padding: 12,
    borderRadius: 8,
    gap: 10,
    marginBottom: 18,
  },
  avisoTxt: {
    color: "#f3e2a4",
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  codigo: {
    fontFamily: "Courier",
    color: "#fff",
  },
  label: {
    color: "#eee",
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 4,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  sublabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },
  chipsLinha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#1f1f1f",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2b2b2b",
  },
  chipAtivo: {
    backgroundColor: "#ff5a5f",
    borderColor: "#ff5a5f",
  },
  chipTagAtivo: {
    backgroundColor: "#3a82ff",
    borderColor: "#3a82ff",
  },
  chipTxt: {
    color: "#ccc",
    fontWeight: "600",
  },
  chipTxtAtivo: {
    color: "#fff",
  },
  erroCaixa: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#702020",
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
    gap: 10,
  },
  erroTxt: {
    color: "#fff",
    flex: 1,
    fontSize: 13,
  },
});
