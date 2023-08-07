import * as providers from "./providers";
function getProvider(name) {
  if (!providers[name])
    throw new Error(`Unsupported provider: '${name}'`);
  return providers[name];
}
export {
  getProvider
};
