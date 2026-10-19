import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../apps/web/.env' });

const prisma = new PrismaClient();

async function inspectAndClean() {
    console.log('=== Checking Database Tables ===');
    
    // 1. Check Candles
    const candles = await prisma.prayerCandle.findMany({ take: 20 });
    console.log(`Candles (${candles.length}):`, candles.map(c => ({ id: c.id, intention: c.intention, amount: c.amount, createdAt: c.createdAt })));

    // 2. Check Donations
    const donations = await prisma.donation.findMany({ take: 20 });
    console.log(`Donations (${donations.length}):`, donations.map(d => ({ id: d.id, amount: d.amount, donorName: d.donorName, createdAt: d.createdAt })));

    // 3. Check Mass Offerings
    const massOfferings = await prisma.massOffering.findMany({ take: 20 });
    console.log(`Mass Offerings (${massOfferings.length}):`, massOfferings.map(m => ({ id: m.id, intention: m.intention, stipend: m.stipend, status: m.status })));

    // 4. Check Prayer Requests
    const prayerRequests = await prisma.prayerRequest.findMany({ take: 20 });
    console.log(`Prayer Requests (${prayerRequests.length}):`, prayerRequests.map(p => ({ id: p.id, title: p.title, isApproved: p.isApproved })));

    // 5. Check Memorials
    const memorials = await prisma.memorial.findMany({ take: 20 });
    console.log(`Memorials (${memorials.length}):`, memorials.map(m => ({ id: m.id, name: m.name, status: m.status })));

    // 6. Check Articles
    const articles = await prisma.article.findMany({ take: 20 });
    console.log(`Articles (${articles.length}):`, articles.map(a => ({ id: a.id, title: a.title, isPublished: a.isPublished })));

    // 7. Check Users (non-admin)
    const users = await prisma.user.findMany({ take: 20 });
    console.log(`Users (${users.length}):`, users.map(u => ({ id: u.id, email: u.email, name: `${u.firstName || ''} ${u.lastName || ''}` })));

    // 8. Check Admin Users
    const adminUsers = await prisma.adminUser.findMany();
    console.log(`Admin Users (${adminUsers.length}):`, adminUsers.map(a => ({ id: a.id, email: a.email, role: a.role })));
    
    await prisma.$disconnect();
}

inspectAndClean().catch(console.error);
