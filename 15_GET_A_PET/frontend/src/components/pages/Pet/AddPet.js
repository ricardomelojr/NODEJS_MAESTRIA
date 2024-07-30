import api from '../../../utils/api';

import styles from './AddPet.module.css';

import { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

/* HOOKS */
import useFlashMessage from '../../../hooks/useFlashMessage';

/* COMPONENTS */
import PetForm from '../../form/petForm';

function AddPet() {
  const navigate = useNavigate();
  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção.</p>
      </div>
      <PetForm />
    </section>
  );
}

export default AddPet;
