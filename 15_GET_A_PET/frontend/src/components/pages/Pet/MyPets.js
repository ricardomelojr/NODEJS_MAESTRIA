import api from '../../../utils/api';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoundedImage from '../../layout/RoundedImage';
import useFlashMessage from '../../../hooks/useFlashMessage';
import styles from './Dashboard.module.css';

function MyPets() {
  const [pets, setPets] = useState([]);
  const [token] = useState(localStorage.getItem('token') || '');
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get('/pets/mypets', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then(response => {
        setPets(response.data.pets);
      });
  }, [token]);

  async function removePet(id) {
    let msgType = 'success';
    const data = await api.delete(`/pets/${id}`, {
      headers:{
        Authorization: 
      }
    });
  }

  return (
    <section>
      <div className={styles.petlist_header}>
        <h1>MyPets</h1>
        <Link to="/pet/add">Cadastrar Pet</Link>
      </div>
      <div className={styles.petlist_container}>
        {pets.length > 0 ? (
          //<p>Meus Pets cadastrados</p>
          pets.map(pet => (
            <div className={styles.petlist_row} key={pet._id}>
              <RoundedImage
                src={`http://localhost:5000/images/pets/${pet.images[0]}`}
                alt={pet.name}
                width="px75"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.actions}>
                {pet.available ? (
                  <>
                    {pet.adopter && (
                      <button className={styles.conclude_btn}>
                        Concluir adoção
                      </button>
                    )}
                    <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                    <button>Exluir</button>
                  </>
                ) : (
                  <p>Pet já adotado</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Não há Pets Cadastrados</p>
        )}
      </div>
    </section>
  );
}

export default MyPets;
