'use client';

import { useSearchContext } from "@/lib/hook";

const SearchForm = () => {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();
  return (
    <form className='w-full h-full'>
      <input
        className='w-full h-full px-5 transition rounded-md outline-none bg-white/20 focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50'
        placeholder='Search pets'
        type='search'
        onChange={(e) => handleChangeSearchQuery(e.target.value)}
        value={searchQuery}
      />
    </form>
  );
};

export default SearchForm;
