'use client';

import { usePetContext, useSearchContext } from '@/lib/hook';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const PetList = () => {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();
  const { searchQuery } = useSearchContext();

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ul className='bg-white border-b border-light'>
      {filteredPets.map((pet) => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPetId(pet.id)}
            className={cn(
              'flex h-[70px] w-full cursor-pointer items-center px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition',
              {
                'bg-[#EFF1F2]': selectedPetId === pet.id,
              },
            )}
          >
            <Image
              src={pet.imageUrl}
              alt='Pet image'
              width={45}
              height={45}
              className='object-cover rounded-full w-[45px] h-[45px]'
            />
            <p className='font-semibold'>{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PetList;
