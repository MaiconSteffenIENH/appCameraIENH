# App de Câmera + Cloudinary

Aplicativo React Native (Expo) que:

1. **Tira foto** com a câmera do celular.
2. **Envia para o Cloudinary** (backend que hospeda a imagem na nuvem).
3. **Aplica uma transformação** escolhida pelo usuário (P&B, sépia, sketch,
   pintura, etc.) usando as URLs de transformação do próprio Cloudinary —
   sem consumir storage adicional e sem precisar de IA paga.
4. Mostra **comparação antes/depois** com slider arrastável.
5. Mantém **histórico/galeria** local de todos os envios.

## Funcionalidades

- Câmera com troca de lente, flash e atalho para a galeria.
- 8 filtros prontos (Original, P&B, Sépia, Vintage, Sketch, Pintura,
  Desfoque, Pixel) processados pelo Cloudinary on-the-fly.
- Slider antes/depois comparando a versão original com a filtrada.
- Histórico em grid persistido em `AsyncStorage` (com remoção por long-press).
- Links clicáveis que abrem as fotos hospedadas no Cloudinary no navegador.

## Como configurar o Cloudinary (sem cartão de crédito)

1. Cadastre-se grátis em https://cloudinary.com
2. No **Dashboard**, copie o **Cloud name** (canto superior esquerdo).
   Cole em `CLOUDINARY_CLOUD_NAME` dentro de `config.js`.
3. No topo da tela, clique na **engrenagem (Settings)** → aba **Upload**.
4. Role até **Upload presets** → **Add upload preset**.
5. Em **Signing Mode**, escolha **Unsigned**.
6. (Opcional) Em **Folder**, digite `app-camera` para organizar as fotos.
7. Clique em **Save** e copie o **nome do preset**.
8. Cole em `CLOUDINARY_UPLOAD_PRESET` dentro de `config.js`.

### Cota gratuita do Cloudinary

- 25 GB de armazenamento
- 25 GB de banda/mês
- Transformações **ilimitadas** (filtros, crop, resize, etc.)
- Sem expiração / sem cartão de crédito

## Como rodar

```bash
npm install
npm start                   # ou:
npx expo start --lan        # mesmo WiFi do celular (recomendado)
npx expo start --tunnel     # se LAN não funcionar
```

Escaneie o QR no Expo Go (Android) ou Câmera (iOS).

## Estrutura do projeto

```
app-camera/
├── App.js                       # Navegação (stack) entre as 4 telas
├── config.js                    # Credenciais e lista de filtros
├── components/
│   ├── Botao.js                 # Botão reutilizável (3 variantes)
│   └── TelaCarregando.js        # Overlay de loading
├── services/
│   ├── cloudinaryService.js     # Upload + montagem de URLs
│   └── historyStorage.js        # Persistência em AsyncStorage
└── screens/
    ├── CameraScreen.js          # Captura da foto
    ├── PreviewScreen.js         # Escolhe filtro e envia ao Cloudinary
    ├── CompareScreen.js         # Antes / Depois + links Cloudinary
    └── GalleryScreen.js         # Histórico
```

## Distribuição entre os 4 integrantes (≥100 linhas por pessoa)

| Integrante | Arquivos sob responsabilidade |
|------------|-------------------------------|
| Pessoa 1   | `screens/CameraScreen.js` + `App.js` |
| Pessoa 2   | `screens/PreviewScreen.js` + `config.js` |
| Pessoa 3   | `screens/CompareScreen.js` + `components/TelaCarregando.js` |
| Pessoa 4   | `screens/GalleryScreen.js` + `services/cloudinaryService.js` + `services/historyStorage.js` + `components/Botao.js` |

Contagem de linhas:

```bash
wc -l App.js config.js components/*.js services/*.js screens/*.js
```

## Troubleshooting

- **`Incompatible with this version of Expo Go`** → o SDK do projeto não bate
  com a versão do Expo Go instalada no celular. Mantenha o `package.json` no
  SDK 54 e atualize o Expo Go na loja.
- **`Cloudinary respondeu 401`** → o preset não é "unsigned". Volte em
  *Settings → Upload* e marque o preset como `Unsigned`.
- **`Cloudinary respondeu 400`** → cloud name ou nome do preset digitado
  errado em `config.js`.
- **`Cannot read property 'Base64' of undefined`** → garantir que
  `cloudinaryService.js` importa de `expo-file-system/legacy`.
- **Tunnel falha (`remote gone away`)** → use `npx expo start --lan` em
  vez de `--tunnel`.

## Como demonstrar na apresentação

1. Abra o app, tire uma foto qualquer.
2. Na tela de preview, escolha um filtro (ex.: "Sketch" ou "Sépia").
3. Toque em "Enviar para o Cloudinary". O loader mostra o status.
4. Na tela de comparação, arraste o slider para revelar antes/depois.
5. Em paralelo, abra o **Media Library** do Cloudinary no navegador —
   a foto que você acabou de enviar aparece dentro da pasta `app-camera`.
6. Clique nos links "URL original" ou "URL com filtro" no app — eles
   abrem o navegador mostrando que a imagem está realmente hospedada na
   nuvem e a transformação é aplicada pelo Cloudinary, não pelo app.
