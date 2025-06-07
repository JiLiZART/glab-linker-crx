import { useState } from 'react';

export const useLocationId = () => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const [id, setId] = useState(params.get('id'));

  return {
    id,
    setId: (id: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.pushState({}, '', url.toString());
      setId(id);
    },
  };
};
