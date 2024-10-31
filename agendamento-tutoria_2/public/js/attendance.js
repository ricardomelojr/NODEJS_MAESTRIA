document.getElementById('attendanceForm').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevenir o comportamento padrão do formulário
  console.log('Submissão do formulário iniciada.');

  const form = new FormData(this);
  const attendanceDate = form.get('attendanceDate');
  const attendance = {};
  const idAvailability = document.getElementById('idAvailability').value; // Pegando o valor diretamente do input

  // Extrair dados de presença
  form.forEach((value, key) => {
    if (key.startsWith('attendance_')) {
      const userId = key.split('_')[1];
      attendance[userId] = value;
    }
  });

  const data = { attendanceDate, attendance };

  try {
    const response = await fetch(`/tutor/attendance/${idAvailability}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('Resposta do servidor:', result);

    if (response.ok) {
      // Redireciona para o histórico de presença, onde a mensagem de sucesso aparecerá
      window.location.href = '/tutor/attendance/history';
    } else {
      // Aqui, em vez de um alert, apenas deixa o Controller enviar a mensagem de erro por req.flash
      console.error(result.error || 'Erro ao salvar a presença.');
      window.location.href = '/tutor/attendance/history';
    }
  } catch (error) {
    console.error('Erro ao enviar a presença:', error);
    // Redireciona para a página onde a mensagem de erro será exibida
    window.location.href = '/tutor/attendance/history';
  }
});
