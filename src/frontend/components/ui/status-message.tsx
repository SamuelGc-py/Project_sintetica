type SearchParams = Record<string, string | string[] | undefined>;

function getParam(params: SearchParams | undefined, key: "success" | "error") {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function StatusMessage({ params }: { params?: SearchParams }) {
  const success = getParam(params, "success");
  const error = getParam(params, "error");

  if (!success && !error) {
    return null;
  }

  return (
    <div
      className={
        success
          ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
      }
    >
      {success ?? error}
    </div>
  );
}
