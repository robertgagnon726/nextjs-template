export function slugifyFileName(fileName: string): string | undefined {
  // Separate the file name from its extension
  const extension = fileName.split('.').pop();
  if (!extension) {
    return undefined;
  }
  const nameWithoutExtension = fileName.slice(0, -(extension.length + 1));

  // Convert to a slug: lowercase, remove special characters, replace spaces with hyphens
  const slugifiedName = nameWithoutExtension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens

  // Return the slugified name with its extension
  return `${slugifiedName}.${extension}`.trim();
}
