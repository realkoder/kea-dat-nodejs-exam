export function capitalizeName(name) {
  return name.replace(/\b\w/g, firstLetter => firstLetter.toUpperCase());
}
