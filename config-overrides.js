module.exports = function override(config, env) {
  // Add src/ to resolve modules path.
  config.resolve.modules.push("src");

  return config;
}
