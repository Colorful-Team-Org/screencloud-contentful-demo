export function parseSearch(params: URLSearchParams) {
  return Array.from(params.entries()).reduce((acc, curr) => {
    acc[curr[0]] = curr[1];
    return acc;
  }, {} as Record<string, string>);
}
