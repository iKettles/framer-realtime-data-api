import LocalConfig from './local';
import ProductionConfig from './production';
import TestConfig from './test';
import StagingConfig from './staging';

const env = process.env.NODE_ENV || 'local';

const configMap = new Map<string, Config>([
  ['local', LocalConfig],
  ['production', ProductionConfig],
  ['staging', StagingConfig],
  ['test', TestConfig]
]);

if(!configMap.has(env)) {
  throw new Error(`No config found for NODE_ENV: ${env}`);
} else {
  console.log(`Config loaded for environment ${env}`);
}

export default configMap.get(env) as Config;
