import type { SomeZodObject } from "zod";

/**
 * Converts data from the database to the desired type.
 */
export async function deserialize<T extends Record<string, unknown>>(
  data: Record<string, unknown>,
  {
    deserializer,
    fieldPrefix = "",
  }: {
    deserializer: Pick<SomeZodObject, "parseAsync">;
    fieldPrefix?: string;
  }
): Promise<T> {
  const dataKeys = Object.keys(data);
  const raw = {} as Record<string, unknown>;
  for (const key of dataKeys) {
    const dbField = fieldPrefix ? `${fieldPrefix}${key}` : key;
    raw[key] = data[dbField];
  }

  return (await deserializer.parseAsync(raw)) as T;
}
