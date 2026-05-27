import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_HISTORICO = "@cameraDecor:historico";

export async function carregarHistorico() {
  try {
    const bruto = await AsyncStorage.getItem(CHAVE_HISTORICO);
    if (!bruto) return [];
    const lista = JSON.parse(bruto);
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    console.warn("Falha ao carregar histórico:", erro);
    return [];
  }
}

export async function adicionarAoHistorico(item) {
  const atual = await carregarHistorico();
  const entrada = {
    id: String(Date.now()),
    criadoEm: new Date().toISOString(),
    ...item,
  };
  const novo = [entrada, ...atual];
  await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(novo));
  return entrada;
}

export async function removerDoHistorico(id) {
  const atual = await carregarHistorico();
  const novo = atual.filter((entrada) => entrada.id !== id);
  await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(novo));
  return novo;
}

export async function limparHistorico() {
  await AsyncStorage.removeItem(CHAVE_HISTORICO);
}
