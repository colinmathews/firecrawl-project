export type EnvironmentVar =
  | "AIRTABLE_API_KEY"
  | "AIRTABLE_BASE_ID"
  | "LOG_FORMAT"
  | "LOG_LEVEL"
  | "FIRECRAWL_API_KEY";

export const getEnvironment = (): string => {
  return process.env.NODE_ENV || "development";
};

export const getEnvironmentVar = (
  varName: EnvironmentVar
): string | undefined => {
  return process.env[varName];
};

export const getRequiredEnvironmentVar = (varName: EnvironmentVar): string => {
  const value = getEnvironmentVar(varName);
  if (!value) throw new Error(`Environment variable ${varName} is not set.`);
  return value;
};
