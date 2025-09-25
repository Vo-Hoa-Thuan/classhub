const cron = require('node-cron');
const TokenService = require('./tokenService');

class SchedulerService {
    static start() {
        // Cleanup expired tokens every hour
        cron.schedule('0 * * * *', async () => {
            try {
                console.log('Starting token cleanup...');
                const result = await TokenService.cleanupExpiredTokens();
                console.log(`Token cleanup completed. Deleted ${result.deletedCount} expired tokens.`);
            } catch (error) {
                console.error('Token cleanup failed:', error);
            }
        });

        // Cleanup revoked tokens every 6 hours
        cron.schedule('0 */6 * * *', async () => {
            try {
                console.log('Starting revoked token cleanup...');
                const result = await TokenService.cleanupExpiredTokens();
                console.log(`Revoked token cleanup completed. Deleted ${result.deletedCount} tokens.`);
            } catch (error) {
                console.error('Revoked token cleanup failed:', error);
            }
        });

        console.log('Scheduler service started successfully');
    }

    static stop() {
        cron.getTasks().forEach(task => task.destroy());
        console.log('Scheduler service stopped');
    }
}

module.exports = SchedulerService;
