import api from '../../../utils/api';
import styles from './AddPet.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFlashMessage from '../../../hooks/useFlashMessage';
import PetForm from '../../form/PetForm';

function AddPet() {
  const [token, setToken] = useState('');
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  const registerPet = async pet => {
    const formData = new FormData();
    Object.keys(pet).forEach(key => {
      if (key === 'images') {
        pet[key].forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append(key, pet[key]);
      }
    });

    try {
      const response = await api.post('pets/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setFlashMessage(response.data.message, 'success');
      navigate('/pets/mypets');
    } catch (err) {
      setFlashMessage(err.response.data.message, 'error');
    }
  };

  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção.</p>
      </div>
      <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
    </section>
  );
}

export default AddPet;
