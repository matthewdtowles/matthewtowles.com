// Maps a page path to its OG image filename. Shared by the layout, which emits
// the meta tag, and the build script, which writes the file, so the two cannot
// drift apart.
export function ogSlug(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (clean === '') return 'index';
  return clean.replace(/\//g, '-');
}
