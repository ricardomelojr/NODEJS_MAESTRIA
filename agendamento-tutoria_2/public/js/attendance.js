document.getElementById('attendanceForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = new FormData(this);
  const attendanceDate = form.get('attendanceDate');
  const attendance = {};
  const idAvailability = document.getElementById('idAvailability').value;

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

    if (response.ok) {
      // Exibir a mensagem de sucesso no Snackbar sem redirecionar
      showSnackbar(result.message, 'success');
    } else {
      showSnackbar(result.error || 'Erro ao salvar a presença.', 'error');
    }
  } catch (error) {
    console.error('Erro ao enviar a presença:', error);
    showSnackbar('Erro ao enviar a presença.', 'error');
  }
});
