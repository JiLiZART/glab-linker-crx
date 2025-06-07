
function tryJSONParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export const jsonSerialization = {
  serialize(value: unknown) {
    return JSON.stringify(value);
  },
  deserialize(text: string) {
    return tryJSONParse(text);
  },
}
