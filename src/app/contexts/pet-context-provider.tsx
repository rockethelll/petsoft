'use client';

import { addPet, deletePet, editPet } from '@/actions/actions';
import { PetEssentials } from '@/lib/types';
import { Pet } from '@prisma/client';
import {
  createContext,
  useState,
  useMemo,
  useOptimistic,
  useCallback,
  startTransition,
} from 'react';
import { toast } from 'sonner';

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet['id'] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet['id'], newPetData: PetEssentials) => void;
  handleCheckoutPet: (id: Pet['id']) => Promise<void>;
  handleChangeSelectedPetId: (id: Pet['id']) => void;
};

export const PetContext = createContext<TPetContext | null>(null);

const PetContextProvider = ({ children, data }: PetContextProviderProps) => {
  // State
  const [optimisticPets, setOptimisticPets] = useOptimistic(data, (state, { action, payload }) => {
    switch (action) {
      case 'add':
        return [...state, { ...payload, id: Math.random().toString() }];
      case 'edit':
        return state.map((pet) => {
          if (pet.id === payload.id) return { ...pet, ...payload.newPetData };
          return pet;
        });
      case 'delete':
        return state.filter((pet) => pet.id !== payload);
      default:
        return state;
    }
  });
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Derived State
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // Event Handlers / actions
  const handleAddPet = useCallback(
    async (newPet: PetEssentials) => {
      setOptimisticPets({ action: 'add', payload: newPet });
      const error = await addPet(newPet);
      if (error) {
        toast.warning(error.message);
        return;
      }
      toast.success('Pet added successfully.');
    },
    [setOptimisticPets],
  );

  const handleEditPet = useCallback(
    async (petId: Pet['id'], newPetData: PetEssentials) => {
      setOptimisticPets({ action: 'edit', payload: { id: petId, newPetData } });
      const error = await editPet(petId, newPetData);
      if (error) {
        toast.warning(error.message);
        return;
      }
      toast.success('Pet edited successfully.');
    },
    [setOptimisticPets],
  );

  const handleCheckoutPet = useCallback(
    async (petId: Pet['id']) => {
      startTransition(() => {
        setOptimisticPets({ action: 'delete', payload: petId });
      });
      const error = await deletePet(petId);
      if (error) {
        toast.warning(error.message);
        return;
      }
      setSelectedPetId(null);
      toast.success('Pet checked out successfully.');
    },
    [setOptimisticPets],
  );

  const handleChangeSelectedPetId = (id: Pet['id']) => {
    setSelectedPetId(id);
  };

  const value = useMemo(
    () => ({
      pets: optimisticPets,
      selectedPetId,
      selectedPet,
      numberOfPets,
      handleAddPet,
      handleEditPet,
      handleCheckoutPet,
      handleChangeSelectedPetId,
    }),
    [
      optimisticPets,
      selectedPetId,
      selectedPet,
      numberOfPets,
      handleAddPet,
      handleEditPet,
      handleCheckoutPet,
    ],
  );

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
};

export default PetContextProvider;
