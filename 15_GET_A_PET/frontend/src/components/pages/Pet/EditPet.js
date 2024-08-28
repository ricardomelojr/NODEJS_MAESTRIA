import api from '../../../utils/api';

import { useState, useEffect } from 'react';

import styles from './AddPet.module.css';

import PetForm from '../../form/PetForm';

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage';

function EditPet() {
  const [pet, setPet] = useState({});
  const [token] = useState(localStorage.getItem('token') || '');

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: 'pet.name'</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
      </div>
    </section>
  );
}

export default EditPet;
