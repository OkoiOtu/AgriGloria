const BASE = import.meta.env.BASE_URL

export const imgUrl = (filename) => {
  if (!filename) return `${BASE}assets/images/Agri_logo.png`
  if (filename.startsWith('http') || filename.startsWith('data:')) return filename
  return `${BASE}assets/images/${filename}`
}
export const galleryUrl = (filename) => `${BASE}assets/gallery/${filename}`
export const videoUrl = (filename) => `${BASE}assets/videos/${filename}`
