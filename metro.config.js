const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Isso força o Metro a usar apenas a versão do React que está na raiz
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return context.resolveRequest(context, path.resolve(__dirname, 'node_modules/react'), platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;