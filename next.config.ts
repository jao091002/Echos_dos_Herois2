import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // multijogador em rede local: amigos abrem o jogo pelo IP desta máquina (ex.: http://192.168.0.10:3000).
  // Em desenvolvimento o Next bloqueia origens diferentes de localhost; estas são as faixas de IP de rede local.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
};
export default nextConfig;
