import * as amqp from 'amqplib/callback_api';
const createAccountWebhook = `create_account_actions_${process.env.envIs}`;
class RabbitMq {
  public channel: any;
  constructor() {
    console.log('Rabbit mq working here for credential', process.env.RabbitMq);
    this.startServer();
  }
  public async startServer() {
    try {
      await this.connect()
        .then(
          (res: any) => {
            this.channel = res;
            console.log('Connection sucessfuly created');
            // START ALL THE QUEUES HERE
            this.assertQueue(createAccountWebhook);
          },
          (error: any) => {
            console.log('Error of rabbit queue', error);
            return error;
          },
        )
        .catch((err) => {
          console.log('The err of rb is ', err);
        });
    } catch (error) {
      console.log('Error of rb is ', error);
    }

  }
  public async connect() {
    try {
      return new Promise((resolve, reject) => {
        amqp.connect(process.env.RabbitMq, async (err, conn) => {
          if (err) {
            console.log('the rabbit error', err);
            reject(err);
          }
          conn.createChannel(async (eror, ch) => {
            if (eror) {
              console.log('the error is ', eror);
              reject(eror);
            }
            resolve(ch);
          });
        });
      });
    } catch (error) {
      console.log('error while connecting rabbit', error);
    }
  }
  public assertQueue(queue: string) {
    this.channel.assertQueue(queue, { durable: false });
  }
  public async consumeQueue(queue: string) {
    console.log("CONSUME QUEUE WORKING HERE");
    this.channel.consume(
      queue, async (msg: any) => {
        const data = JSON.parse(msg.content.toString());
        this.channel.ack(msg);
        return data;
      },
      { noAck: false });
  }
  public createQueue(queue: string, data: any) {
    console.log("CREATE QUEUE WORKING HERE");
    try {
      this.channel.sendToQueue(queue, Buffer.from(data));
      
    } catch (error) {
      console.log('rabbit create queue error is ', error);
    }
  }
  public createAccount(data: any) {
    console.log('create queue for data', JSON.stringify(data));
    console.log("create account for queue name",createAccountWebhook);
    try{
      this.createQueue(createAccountWebhook, JSON.stringify(data));
    }catch(err){
      console.log("erro while create  queue for create account",err);
    }
  }
}
export default new RabbitMq();
