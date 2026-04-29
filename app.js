const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const tickets = {
  'TK-001': { evento: 'Concierto Coldplay', zona: 'A', estado: 'válido' },
  'TK-002': { evento: 'Concierto Coldplay', zona: 'B', estado: 'válido' },
  'TK-003': { evento: 'Concierto Coldplay', zona: 'VIP', estado: 'usado' },
};

app.get('/validar', (req, res) => {
  const { ticket_id } = req.query;

  if (!ticket_id) {
    return res.status(400).json({
      replica: PORT,
      status: 'error',
      mensaje: 'Debe proporcionar un ticket_id'
    });
  }

  const ticket = tickets[ticket_id];

  if (!ticket) {
    return res.status(404).json({
      replica: PORT,
      status: 'rechazado',
      mensaje: `Ticket ${ticket_id} no encontrado`
    });
  }

  return res.json({
    replica: PORT,
    status: ticket.estado === 'válido' ? 'aprobado' : 'rechazado',
    ticket_id,
    detalle: ticket
  });
});

// Sirve para que NGINX detecte si una réplica está caída (tolerancia a fallos)
app.get('/health', (req, res) => {
  res.json({ replica: PORT, status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Réplica corriendo en puerto ${PORT}`);
});
