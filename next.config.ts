import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Ativa otimizações do compilador
    optimizePackageImports: [
      'lucide-react',
      '@clerk/nextjs',
      'recharts',
      'date-fns',
    ],
  },
  // Otimiza imagens e recursos estáticos
  compress: true,
  // Reduz o tamanho do bundle removendo source maps em produção
  productionBrowserSourceMaps: false,
};

export default nextConfig;
