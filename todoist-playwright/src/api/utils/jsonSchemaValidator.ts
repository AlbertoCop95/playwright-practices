import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

// --- 1. Initialize a single Ajv instance ---
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// --- 2. Register all your schemas (optional central registry) ---
import TasksSchema from '../schemas/getTasks.schema.json';

const schemas = {
  tasksSchema: ajv.compile(TasksSchema),
};

// --- 3. Generic helper ---
export async function validateSchema<T>(
  schemaName: keyof typeof schemas,
  data: unknown
): Promise<boolean> {
  const validateFn = schemas[schemaName] as ValidateFunction<T>;
  const ok = validateFn(data);

  if (!ok) {
    const errors = ajv.errorsText(validateFn.errors, { separator: '\n' });
    throw new Error(`❌ Schema validation failed for [${schemaName}]:\n${errors}`);
  }

  return true;
}
