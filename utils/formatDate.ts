export const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
