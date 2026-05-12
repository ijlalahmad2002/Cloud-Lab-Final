const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('EVENT_CREATED');

    console.log('Notification Service waiting for messages...');

    channel.consume('EVENT_CREATED', (msg) => {
      const eventData = JSON.parse(msg.content.toString());
      console.log('Received Event:', eventData);

      // Lakehouse-style ingestion: Store as JSON file
      const fileName = `event-${eventData.eventId}-${Date.now()}.json`;
      fs.writeFileSync(path.join(LOG_DIR, fileName), JSON.stringify(eventData, null, 2));
      
      console.log(`Saved log to ${fileName}`);
      channel.ack(msg);
    });
  } catch (err) {
    console.error('Consumer Error:', err);
    setTimeout(startConsumer, 5000); // Retry if RabbitMQ isn't ready
  }
}

startConsumer();
