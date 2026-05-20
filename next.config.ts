import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ['pdf-parse'],        
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
