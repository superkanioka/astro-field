/** サイト内パスに base（GitHub Pages では /astro-field）を付ける。path は "/" 始まりで渡す。 */
export function url(path: string): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}
