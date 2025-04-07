import { createProxyServer } from 'http-proxy';

// export function createChatMediaProxy(configService: ConfigService) {
//   const target = `${configService.get<string>('services.chat.container_name')}:${configService.get<string>('services.chat.port')}`;

//   return createProxyMiddleware({
//     target,
//     changeOrigin: true,
//     selfHandleResponse: true,
//     pathRewrite: () => '/api/v1/chat/media/upload',
//     on: {
//       proxyReq: (proxyReq, req, res) => {
//         console.log(
//           ` → Forwarded to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
//         );
//       },
//       proxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
//         console.log('change response content-type');
//         res.setHeader('content-type', 'application/json; charset=utf-8');

//         console.log('change response status code');
//         res.statusCode = 418;

//         console.log('return a complete different response');
//         return JSON.stringify({ message: 'success' });
//       }),
//     },
//     logger: console,
//   });
// }

const proxy = createProxyServer({
  target: 'http://localhost:3005',
  changeOrigin: true,
  selfHandleResponse: true,
});

proxy.on('proxyReq', (proxyReq, req, res) => {
  console.log('request.x-user-id', req.headers['x-user-id']);
  console.log('request.x-conversation-id', req.headers['x-conversation-id']);
  console.log('request.x-original-filename', req.headers['x-original-filename']);

  console.log(
    ` → Forwarded to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`,
  );
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  console.log('Response from target received');
});

proxy.on('error', function (e) {
  console.error('Proxy error:', e);
});

export default proxy;
