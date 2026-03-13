import { createLogger, log as internalLog } from '@ccusage/internal/logger';

import pkg from '../package.json' with { type: 'json' };
const { name } = pkg;

export const logger = createLogger(name);

export const log = internalLog;
