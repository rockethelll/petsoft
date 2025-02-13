'use client';

import { usePetContext } from '@/lib/hook';
import Image from 'next/image';
import PetButton from './pet-button';
import { Pet } from '@prisma/client';

const PetDetails = () => {
  const { selectedPet } = usePetContext();

  return (
    <section className='flex flex-col w-full h-full'>
      {!selectedPet ? (
        <EmptyView />
      ) : (
        <>
          <TopBar pet={selectedPet} />
          <OtherInfos pet={selectedPet} />
          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
};

export default PetDetails;

function EmptyView() {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='text-2xl font-medium'>No pet selected</div>
    </div>
  );
}

type Props = {
  pet: Pet;
};

function TopBar({ pet }: Readonly<Props>) {
  const { handleCheckoutPet } = usePetContext();

  return (
    <div className='flex items-center px-8 py-5 bg-white border-b border-light'>
      <Image
        src={pet.imageUrl}
        alt='Selected pet image'
        width={75}
        height={75}
        className='w-[75px] h-[75px] rounded-full object-cover'
      />
      <h2 className='ml-5 text-3xl font-semibold leading-7'>{pet.name}</h2>
      <div className='ml-auto space-x-2'>
        <PetButton actionType='edit'>Edit</PetButton>
        <PetButton
          actionType='checkout'
          onClick={async () => {
            await handleCheckoutPet(pet.id);
          }}
        >
          Checkout
        </PetButton>
      </div>
    </div>
  );
}

function OtherInfos({ pet }: Readonly<Props>) {
  return (
    <div className='flex justify-around px-5 py-10 text-center'>
      <div>
        <h3 className='text-[13px] font-medium uppercase text-zinc-700'>Owner Name</h3>
        <p className='mt-1 text-lg text-zinc-800'>{pet.ownerName}</p>
      </div>
      <div>
        <h3 className='text-[13px] font-medium uppercase text-zinc-700'>Age</h3>
        <p className='mt-1 text-lg text-zinc-800'>{pet.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: Readonly<Props>) {
  return (
    <section className='flex-1 py-5 mx-8 bg-white border rounded-md px-7 mb-9 border-light'>
      {pet.notes}
    </section>
  );
}
