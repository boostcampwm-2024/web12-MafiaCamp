export function sanitizeData(data: any): Record<string, any> {
  if (!data) return data;

  const sanitized = { ...data };
  const sensitiveFields = ['password', 'token', 'secret','code'];

  sensitiveFields.forEach((field) => {
    if (field in sanitized) {
      sanitized[field] = '***filtered**data***';
    }
  });

  return sanitized;
}
