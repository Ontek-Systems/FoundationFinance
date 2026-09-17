// Static export (GitHub Pages) serves the site from a sub-path, so local images need the base path prefixed
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function imageLoader({ src }) {
  if (!src.startsWith('/')) return src
  return `${BASE_PATH}${src}`
}
