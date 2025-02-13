'use client';

import { createContext, useMemo, useState } from 'react';

type TSearchContextProviderProps = {
  children: React.ReactNode;
};

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newValue: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);

const SearchContextProvider = ({ children }: TSearchContextProviderProps) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');

  // Derived State

  // Event Handlers / actions
  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue);
  };

  const value = useMemo(
    () => ({
      searchQuery,
      handleChangeSearchQuery,
    }),
    [searchQuery],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export default SearchContextProvider;
