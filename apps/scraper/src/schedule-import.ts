
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

const FULL_IMPORT_INTERVAL_DAYS = 15;

async function runCommand(command: string) {
    console.log(`Running: ${command}`);
    try {
        const { stdout, stderr } = await execAsync(command);
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error(`Error running ${command}:`, error);
        throw error;
    }
}

async function main() {
    console.log('📅 Starting Smart Scheduler...');

    // 1. Check last full import status
    const lastFullSync = await prisma.syncLog.findFirst({
        where: {
            source: 'gcatholic',
            type: 'full-import', // We'll verify this tag is used or add it
            status: 'COMPLETED',
        },
        orderBy: {
            startedAt: 'desc',
        },
    });

    const now = new Date();
    let shouldRunFullImport = false;
    let reason = '';

    if (!lastFullSync) {
        shouldRunFullImport = true;
        reason = 'No previous full import log found.';
    } else {
        const daysSince = (now.getTime() - lastFullSync.startedAt.getTime()) / (1000 * 60 * 60 * 24);
        console.log(`Last full sync was ${daysSince.toFixed(2)} days ago.`);

        if (daysSince >= FULL_IMPORT_INTERVAL_DAYS) {
            shouldRunFullImport = true;
            reason = `Interval of ${FULL_IMPORT_INTERVAL_DAYS} days exceeded.`;
        }
    }

    // Check for force flag
    if (process.argv.includes('--force')) {
        shouldRunFullImport = true;
        reason = 'Forced via command line argument.';
    }

    // 2. Execute appropriate tasks
    try {
        if (shouldRunFullImport) {
            console.log(`🚀 TRIGGERING FULL IMPORT: ${reason}`);

            // Log the start
            await prisma.syncLog.create({
                data: {
                    source: 'gcatholic',
                    type: 'full-import',
                    status: 'RUNNING',
                    startedAt: new Date(),
                    triggeredBy: 'scheduler',
                },
            });

            // Run the heavy scripts
            // Note: We run them sequentially to avoid memory issues
            await runCommand('npm run import:gcatholic:dioceses'); // Ensure region structure
            await runCommand('npm run import:gcatholic:saints:complete');
            await runCommand('npm run import:gcatholic:churches:complete');

            // Update log to completed
            const activeLog = await prisma.syncLog.findFirst({
                where: { source: 'gcatholic', type: 'full-import', status: 'RUNNING' },
                orderBy: { startedAt: 'desc' }
            });

            if (activeLog) {
                await prisma.syncLog.update({
                    where: { id: activeLog.id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date(),
                        errorMessage: 'Success'
                    }
                });
            }

        } else {
            console.log(`✨ Skipping full import (${reason}).`);
        }

        // 3. ALWAYS run RSS Sync (Daily check)
        console.log('📡 Running Daily RSS Sync...');
        await runCommand('npx ts-node src/sync-gcatholic-rss.ts');

        console.log('✅ Scheduler finished successfully.');

    } catch (error) {
        console.error('❌ Scheduler failed:', error);
        // Try to log failure
        const activeLog = await prisma.syncLog.findFirst({
            where: { source: 'gcatholic', type: 'full-import', status: 'RUNNING' },
            orderBy: { startedAt: 'desc' }
        });
        if (activeLog) {
            await prisma.syncLog.update({
                where: { id: activeLog.id },
                data: {
                    status: 'FAILED',
                    completedAt: new Date(),
                    errorMessage: String(error)
                }
            });
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
