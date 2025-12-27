
import 'dotenv/config';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

async function verify() {
    console.log('📊 GCatholic Import Verification');
    console.log('================================\n');

    const dioceseCount = await prisma.diocese.count();
    console.log(`✅ Dioceses: ${dioceseCount}`);

    const saintCount = await prisma.saint.count();
    console.log(`✅ Saints: ${saintCount}`);

    const churchCount = await prisma.church.count();
    console.log(`✅ Churches: ${churchCount}`);

    // Sample data
    console.log('\n📌 Sample Diocese:');
    const sampleDiocese = await prisma.diocese.findFirst({ where: { region: 'Europe' } });
    if (sampleDiocese) console.log(`   ${sampleDiocese.name} (${sampleDiocese.country})`);

    console.log('\n📌 Sample Saint:');
    const sampleSaint = await prisma.saint.findFirst();
    if (sampleSaint) console.log(`   ${sampleSaint.title} ${sampleSaint.name} - Feast: ${sampleSaint.feastDay}`);

    console.log('\n📌 Sample Church:');
    const sampleChurch = await prisma.church.findFirst({ where: { type: 'CATHEDRAL' } });
    if (sampleChurch) console.log(`   ${sampleChurch.name} (${sampleChurch.type})`);

    await prisma.$disconnect();
}

verify();
