import { HydratedDocument } from 'mongoose';

/**
 * Base type for all Mongoose documents with timestamps
 * Use this to extend your entity document types
 */
export type BaseDocument<T> = HydratedDocument<T> & {
  createdAt: Date;
  updatedAt: Date;
};
