export function getRedirectPath(formData: FormData, fallback: string) {
  const redirectTo = String(formData.get("redirectTo") ?? fallback);
  return redirectTo.startsWith("/") ? redirectTo : fallback;
}

export function withMessage(path: string, type: "success" | "error", message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${type}=${encodeURIComponent(message)}`;
}
