import { getDefaultConfig } from "expo/metro-config"

const config = getDefaultConfig(__dirname)

if (config.resolver) config.resolver.unstable_enablePackageExports = true

export default config
