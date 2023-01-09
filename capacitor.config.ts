import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'florlesbancs',
  webDir: 'build',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
  },
  server: {
    cleartext: true,
    hostname: 'localhost',
  }

};

export default config;
