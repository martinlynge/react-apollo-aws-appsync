export default function truncate(string, length = 100, delimiter = '...') {
  return string.length > length
    ? string.substring(0, length) + delimiter
    : string;
}
