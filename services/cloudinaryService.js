import * as FileSystem from "expo-file-system/legacy";

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config";

function montarEndpoint() {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

function montarBaseEntrega() {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
}

function garantirConfiguracao() {
  if (
    !CLOUDINARY_CLOUD_NAME ||
    CLOUDINARY_CLOUD_NAME === "COLE_SEU_CLOUD_NAME_AQUI" ||
    !CLOUDINARY_UPLOAD_PRESET ||
    CLOUDINARY_UPLOAD_PRESET === "COLE_SEU_UPLOAD_PRESET_AQUI"
  ) {
    throw new Error(
      "Cloudinary não configurado. Defina CLOUDINARY_CLOUD_NAME e " +
        "CLOUDINARY_UPLOAD_PRESET em config.js."
    );
  }
}

export async function enviarImagemParaCloudinary(uriLocal, opcoes = {}) {
  garantirConfiguracao();

  const rotulo = (opcoes.rotulo || "foto").replace(/[^a-zA-Z0-9_-]/g, "");
  const tags = Array.isArray(opcoes.tags) ? opcoes.tags : [];

  const parameters = {
    upload_preset: CLOUDINARY_UPLOAD_PRESET,
    folder: CLOUDINARY_FOLDER || "",
    public_id: `${rotulo}-${Date.now()}`,
  };

  if (tags.length > 0) {
    parameters.tags = tags
      .map((t) => String(t).trim())
      .filter((t) => t.length > 0)
      .join(",");
  }

  const resposta = await FileSystem.uploadAsync(montarEndpoint(), uriLocal, {
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: "file",
    parameters,
  });

  if (resposta.status < 200 || resposta.status >= 300) {
    throw new Error(
      `Cloudinary respondeu ${resposta.status}: ${String(resposta.body).slice(0, 200)}`
    );
  }

  let json;
  try {
    json = JSON.parse(resposta.body);
  } catch (erro) {
    throw new Error(
      "Resposta do Cloudinary não é JSON válido: " + String(resposta.body).slice(0, 200)
    );
  }

  const urlPublica = json.secure_url || json.url;
  const publicId = json.public_id;
  const formato = json.format;

  if (!urlPublica || !publicId) {
    throw new Error(
      "Cloudinary não devolveu secure_url/public_id. Resposta: " +
        JSON.stringify(json).slice(0, 200)
    );
  }

  return {
    urlPublica,
    publicId,
    formato,
    bytes: Number(json.bytes || 0),
    width: Number(json.width || 0),
    height: Number(json.height || 0),
    tags: Array.isArray(json.tags) ? json.tags : tags,
    metadados: json,
  };
}

export function montarUrlComTransformacao(publicId, formato, transformacao) {
  if (!publicId) return null;
  const base = montarBaseEntrega();
  const fmt = formato || "jpg";
  if (!transformacao) {
    return `${base}/${publicId}.${fmt}`;
  }
  return `${base}/${transformacao}/${publicId}.${fmt}`;
}

export function montarMiniatura(publicId, formato) {
  if (!publicId) return null;
  const base = montarBaseEntrega();
  const fmt = formato || "jpg";
  return `${base}/c_fill,w_300,h_300,q_auto/${publicId}.${fmt}`;
}

export function cloudinaryConfigurado() {
  return (
    !!CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_CLOUD_NAME !== "COLE_SEU_CLOUD_NAME_AQUI" &&
    !!CLOUDINARY_UPLOAD_PRESET &&
    CLOUDINARY_UPLOAD_PRESET !== "COLE_SEU_UPLOAD_PRESET_AQUI"
  );
}
