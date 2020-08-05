export function join_sentence(array) {
  return array.reduce((text, value, i, array) => (
    text + (i < array.length - 1 ? ', ' : ' and ') + value)
  );
}