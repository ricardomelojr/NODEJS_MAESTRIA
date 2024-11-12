async function loadSessionDetails(idAvailability, date, index) {
  try {
    const response = await fetch('/tutor/session-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idAvailability, date }),
    });

    const data = await response.json();

    if (data.success) {
      const detailsContainer = document.getElementById(`details-${index}`);
      const dropdown = document.getElementById(`dropdown-${index}`);
      detailsContainer.innerHTML = '';

      data.students.forEach((student) => {
        const row = `
            <tr>
              <td class='py-2 px-4 border-b'>${student.studentName}</td>
              <td class='py-2 px-4 border-b ${student.status === 'Presente' ? 'text-green-600' : 'text-red-600'} font-semibold'>
                ${student.status}
              </td>
            </tr>
          `;
        detailsContainer.insertAdjacentHTML('beforeend', row);
      });

      // Mostrar o dropdown
      dropdown.classList.toggle('hidden');
    } else {
      alert('Erro ao buscar detalhes da sessão.');
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes da sessão:', error);
  }
}
