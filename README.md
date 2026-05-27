# App de Câmera + Cloudinary

Aplicativo React Native (Expo) que:

1. **Tira foto** com a câmera do celular.
2. **Envia para o Cloudinary** (backend que hospeda a imagem na nuvem).
3. **Aplica uma transformação** escolhida pelo usuário (P&B, sépia, sketch,
   pintura, etc.) usando as URLs de transformação do próprio Cloudinary —
   sem consumir storage adicional e sem precisar de IA paga.
4. Mostra **comparação antes/depois**.
5. Mantém **histórico/galeria** local de todos os envios.

## Funcionalidades

- Câmera com troca de lente e atalho para a galeria.
- 8 filtros prontos (Original, P&B, Sépia, Vintage, Sketch, Pintura,
  Desfoque, Pixel) processados pelo Cloudinary on-the-fly.
- Antes/depois.
- Histórico em grid persistido em `AsyncStorage` (com remoção por long-press).
- Links clicáveis que abrem as fotos hospedadas no Cloudinary no navegador.

## Como rodar

```bash
npm install
npm start                   # ou:
npx expo start --lan        # mesmo WiFi do celular (recomendado)
npx expo start --tunnel     # se LAN não funcionar
```

Escaneie o QR no Expo Go (Android) ou Câmera (iOS).
