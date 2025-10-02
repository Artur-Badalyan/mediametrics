import schedule from 'node-schedule';
import log from '#src/helpers/logger/logger';

/**
 * Schedule a job to run at a specific time interval.
 * @param {string} jobName - The name of the job for logging purposes.
 * @param {string} cronExpression - The cron expression for the job schedule.
 * @param {function} job - The asynchronous job to execute.
 * @returns {object} - An object to manage the job.
 */
const scheduleJob = (jobName: string, cronExpression: string, job: () => Promise<void>) => {
  const scheduledJob = schedule.scheduleJob(cronExpression, async () => {
    try {
      await job();
    } catch (error) {
      scheduledJob.cancel();
      log.error(`Job [${jobName}] canceled due to error.`, error);
    }

    // Cancel the job after successful completion if it's a one-time job
    if (scheduledJob.nextInvocation() === null) {
      scheduledJob.cancel();
    }
  });

  return {
    cancel: () => {
      scheduledJob.cancel();
      log.error('schedule::cancel', `Job [${jobName}] manually canceled.`);
    }
  };
};

export default scheduleJob;
