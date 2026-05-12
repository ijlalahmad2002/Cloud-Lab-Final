const express = require('express');
const amqp = require('amqplib');
const sequelize = require('./db');
const Event = require('./Event');

const app = express();
app.use(express.json());

let channel;

// Connect to RabbitMQ
async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();
    await channel.assertQueue('EVENT_CREATED');
    console.log('Connected to RabbitMQ');
  } catch (err) {
    console.error('RabbitMQ Connection Error:', err);
  }
}

// Create Event Route
app.post('/events', async (req, res) => {
  const { title, description, creatorId } = req.body;
  try {
    const event = await Event.create({ title, description, creatorId });
    
    // Send message to RabbitMQ for the Notification Service
    const message = JSON.stringify({ eventId: event.id, title: event.title });
    channel.sendToQueue('EVENT_CREATED', Buffer.from(message));
    
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

const PORT = 3002;
app.listen(PORT, async () => {
  await sequelize.sync();
  await connectRabbitMQ();
  console.log(`Event Service running on port ${PORT}`);
});
