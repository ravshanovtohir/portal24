export function formatDate(el: Date, lang: string) {
  return el.toLocaleString(lang, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
