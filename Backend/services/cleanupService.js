const { cleanupExpiredVerifications } = require('../controllers/emailVerificationController');
const { cleanupExpiredTokens } = require('../controllers/mailController');

class CleanupService {
    constructor() {
        this.isRunning = false;
        this.intervalId = null;
    }

    // Chạy cleanup job mỗi 5 phút
    start() {
        if (this.isRunning) {
            console.log('Cleanup service is already running');
            return;
        }

        console.log('Starting cleanup service...');
        this.isRunning = true;
        
        // Chạy ngay lập tức
        this.runCleanup();
        
        // Sau đó chạy mỗi 5 phút
        this.intervalId = setInterval(() => {
            this.runCleanup();
        }, 5 * 60 * 1000); // 5 phút
    }

    stop() {
        if (!this.isRunning) {
            console.log('Cleanup service is not running');
            return;
        }

        console.log('Stopping cleanup service...');
        this.isRunning = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    async runCleanup() {
        try {
            console.log('Running cleanup job...');
            
            // Cleanup expired email verifications
            const expiredVerifications = await cleanupExpiredVerifications();
            console.log(`Cleaned up ${expiredVerifications} expired email verifications`);
            
            // Cleanup expired reset tokens
            const expiredTokens = await cleanupExpiredTokens();
            console.log(`Cleaned up ${expiredTokens} expired reset tokens`);
            
            console.log('Cleanup job completed successfully');
        } catch (error) {
            console.error('Error running cleanup job:', error);
        }
    }

    // Chạy cleanup ngay lập tức (cho testing hoặc manual trigger)
    async runNow() {
        await this.runCleanup();
    }
}

// Tạo singleton instance
const cleanupService = new CleanupService();

module.exports = cleanupService;
