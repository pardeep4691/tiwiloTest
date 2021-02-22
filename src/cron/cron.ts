import * as cron from 'cron';

const CronJob = cron.CronJob;
class CronService {
  constructor() {
    console.log('cron service running');
  }
}
export default new CronService();
