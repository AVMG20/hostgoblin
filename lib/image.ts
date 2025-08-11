type ImageSize = 'small' | 'medium' | 'large'

/**
 * Gets the API URL for an image
 * @param fileName - Either the fileName string or image ID number
 * @param size - Image size (defaults to 'original')
 */
export function getImageUrl(
    fileName: string | number,
    size: ImageSize | 'original' = 'original'
): string {
    const sizePrefix = size === 'original' ? '' : `${size}-`;
    return `/api/images/${size}/${sizePrefix}${fileName}`;
}