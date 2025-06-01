export function useSettings() {
  return function (url: string | null) {
    return {
      position: 'left-top',
      whitelist: 'https://gitlab.example.com',
      blacklist: 'https://gitlab.example.com',
    };
  };
}
