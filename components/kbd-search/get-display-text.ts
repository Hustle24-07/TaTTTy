export const getDisplayText = (result: any): string => {
  if (result.content) {
    const contentKeys = Object.keys(result.content)
    for (const key of contentKeys) {
      const value = result.content[key]
      if (typeof value === 'string' && value.trim()) {
        return value
      }
    }
  }
  if (result.metadata) {
    const metadataKeys = Object.keys(result.metadata)
    for (const key of metadataKeys) {
      const value = result.metadata[key]
      if (typeof value === 'string' && value.trim()) {
        return value
      }
    }
  }
  return result.id || ''
}

