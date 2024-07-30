import { useState } from 'react';
import formStyles from './Form.module.css';
import Input from './Input';

function PetForm({ handleSugmit, petData, btnText }) {
  const [pet, setPet] = useState(petData || {});
  const { preview, setPreview } = useState({});
  const colors = ['Branco', 'Preto', 'Cinza', 'Caramelo', 'Mesclado'];

  function onFileChange(e) {}
  function handleChange(e) {}

  return (
    <form className={formStyles.form_container}>
      <Input
        text="Imagens do Pet"
        type="file"
        name="images"
        handleOnChange={onFileChange}
        multiple={true}
      />
      <Input
        text="Nome do Pet"
        type="text"
        name="name"
        placeholder="Digite o nome"
        handleOnChange={handleChange}
        value={pet.name || ''}
      />
    </form>
  );
}

export default PetForm;
