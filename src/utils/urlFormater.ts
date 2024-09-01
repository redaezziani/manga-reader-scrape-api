export const removeResize = (url: string): string => {
    return url.replace(/\?resize=190,260/g, '');
}
