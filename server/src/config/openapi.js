import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const specUrl = new URL('./openapi.yaml', import.meta.url);

const source = readFileSync(specUrl, 'utf8').replace(/^\uFEFF/, '');

export const openApiSpec = parse(source);

if (openApiSpec.openapi !== '3.1.0') {
  throw new Error('Invalid NagriVanta OpenAPI specification.');
}
