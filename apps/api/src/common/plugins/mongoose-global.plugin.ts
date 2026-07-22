import { Schema } from 'mongoose';

/**
 * Global Mongoose plugin to configure JSON serialization defaults
 * for all schemas.
 */
export function mongooseGlobalPlugin(schema: Schema) {
  const toJSON = schema.get('toJSON') || {};

  schema.set('toJSON', {
    ...toJSON,
    transform: (doc, ret, options) => {
      const result = ret as Record<string, any>;
      // 1. Remove Mongoose internal version key
      delete result.__v;

      // 2. Execute any existing schema-specific custom transform if defined and callable
      if (toJSON.transform && typeof toJSON.transform === 'function') {
        return (toJSON.transform as Function)(doc, result, options);
      }

      return result;
    },
  });
}
