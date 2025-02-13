import { Button } from './ui/button';

type PetFormBtnProps = {
  actionType: 'add' | 'edit';
};

const PetFormBtn = ({ actionType }: PetFormBtnProps) => {
  return (
    <Button type='submit' className='self-end mt-5'>
      {actionType === 'add' ? 'Add a newPet' : 'Edit pet'}
    </Button>
  );
};

export default PetFormBtn;
