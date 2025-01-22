import React from 'react';
import { useFormContext } from 'react-hook-form';

export const ApiUrlInput = () => {
  const { register } = useFormContext();

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="apiUrl">
        Gitlab Instance Url
      </label>
      <input
        {...register('apiUrl')}
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        placeholder="Введите ваш API BASE URL"
      />
    </div>
  );
};
