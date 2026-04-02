const express = require('express');

const router = express.Router();

const appointments = [];
let idSeq = 1;

/**
 * @openapi
 * /appointment:
 *   post:
 *     summary: Create appointment (same as POST /appointments)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, doctorId, scheduledAt]
 *             properties:
 *               userId: { type: integer }
 *               doctorId: { type: integer }
 *               scheduledAt: { type: string, description: ISO datetime }
 *               reason: { type: string, nullable: true }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 */
function createAppointment(req, res) {
  const { userId, doctorId, scheduledAt, reason } = req.body;
  if (userId == null || doctorId == null || !scheduledAt) {
    return res.status(400).json({ error: 'userId, doctorId, and scheduledAt are required' });
  }
  const appt = {
    id: idSeq++,
    userId: Number(userId),
    doctorId: Number(doctorId),
    scheduledAt,
    reason: reason || null,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  appointments.push(appt);
  return res.status(201).json(appt);
}

router.post('/appointment', createAppointment);

/**
 * @openapi
 * /appointments:
 *   post:
 *     summary: Create appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, doctorId, scheduledAt]
 *             properties:
 *               userId: { type: integer }
 *               doctorId: { type: integer }
 *               scheduledAt: { type: string, description: ISO datetime }
 *               reason: { type: string, nullable: true }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 */
router.post('/appointments', createAppointment);

/**
 * @openapi
 * /appointments:
 *   get:
 *     summary: List appointments
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema: { type: integer }
 *         description: Filter by user id
 *       - in: query
 *         name: doctorId
 *         schema: { type: integer }
 *         description: Filter by doctor id
 *     responses:
 *       200: { description: OK }
 */
router.get('/appointments', (req, res) => {
  const { userId, doctorId } = req.query;
  let list = appointments;
  if (userId != null) list = list.filter((a) => a.userId === Number(userId));
  if (doctorId != null) list = list.filter((a) => a.doctorId === Number(doctorId));
  res.json(list);
});

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by id
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.get('/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  return res.json(appt);
});

/**
 * @openapi
 * /appointments/{id}:
 *   patch:
 *     summary: Update appointment (reschedule, reason, status)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId: { type: integer }
 *               doctorId: { type: integer }
 *               scheduledAt: { type: string }
 *               reason: { type: string, nullable: true }
 *               status: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: No fields to update }
 *       404: { description: Not found }
 */
router.patch('/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  const { userId, doctorId, scheduledAt, reason, status } = req.body;
  if (
    userId === undefined &&
    doctorId === undefined &&
    scheduledAt === undefined &&
    reason === undefined &&
    status === undefined
  ) {
    return res.status(400).json({ error: 'Provide at least one field to update' });
  }
  if (userId !== undefined) appt.userId = Number(userId);
  if (doctorId !== undefined) appt.doctorId = Number(doctorId);
  if (scheduledAt !== undefined) appt.scheduledAt = scheduledAt;
  if (reason !== undefined) appt.reason = reason;
  if (status !== undefined) appt.status = String(status);
  appt.updatedAt = new Date().toISOString();
  return res.json(appt);
});

/**
 * @openapi
 * /appointments/{id}:
 *   put:
 *     summary: Replace appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, doctorId, scheduledAt]
 *             properties:
 *               userId: { type: integer }
 *               doctorId: { type: integer }
 *               scheduledAt: { type: string }
 *               reason: { type: string, nullable: true }
 *               status: { type: string }
 *     responses:
 *       200: { description: OK }
 *       400: { description: Validation error }
 *       404: { description: Not found }
 */
router.put('/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const appt = appointments.find((a) => a.id === id);
  if (!appt) return res.status(404).json({ error: 'Appointment not found' });
  const { userId, doctorId, scheduledAt, reason, status } = req.body;
  if (userId == null || doctorId == null || !scheduledAt) {
    return res.status(400).json({ error: 'userId, doctorId, and scheduledAt are required' });
  }
  appt.userId = Number(userId);
  appt.doctorId = Number(doctorId);
  appt.scheduledAt = scheduledAt;
  appt.reason = reason ?? null;
  appt.status = status != null ? String(status) : 'scheduled';
  appt.updatedAt = new Date().toISOString();
  return res.json(appt);
});

/**
 * @openapi
 * /appointments/{id}:
 *   delete:
 *     summary: Delete appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
router.delete('/appointments/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Appointment not found' });
  const [removed] = appointments.splice(idx, 1);
  return res.json({ message: 'Appointment deleted', appointment: removed });
});

module.exports = router;
