export type SchemaDefinition = {
  name: string;
  label?: string;
  version: string;
  description: string;
  fields: Array<{
    name: string;
    label?: string;
    type: 'string' | 'number' | 'boolean' | 'asset' | 'imageAsset';
    constant?: boolean;
    required?: boolean;
  }>;
};
