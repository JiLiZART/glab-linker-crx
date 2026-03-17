import { useState } from 'react';

export const useLocationId = (defaultId?: string) => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const [id, setId] = useState(params.get('id') || defaultId);

  return {
    id,
    setId: (id: string) => {
      console.log('useLocationId.setId', { id });

      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.pushState({}, '', url.toString());
      setId(id);
    },
  };
};
