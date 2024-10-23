// src/utils/utils.js

export const formatTime = (time) => {
  if (!time) return ''; // Se não houver tempo, retorna string vazia

  // Divide a string do horário em horas, minutos e segundos
  const [hours, minutes] = time.split(':');

  // Cria uma nova data com a hora fornecida
  const date = new Date();
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0); // Define horas e minutos

  // Formata o horário como uma string
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Para usar formato de 24 horas
  };

  return date.toLocaleTimeString('pt-BR', options);
};
