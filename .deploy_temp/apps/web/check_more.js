
const { PrismaClient } = require('@mpt/database');
const prisma = new PrismaClient();

// Handle BigInt serialization
BigInt.prototype.toJSON = function () { return this.toString() }

async function checkMore() {
    const titles = [
        'Jude',
        'Night',
        'Examen',
        'Compline'
    ];

    const prayers = await prisma.prayer.findMany({
        where: {
            OR: titles.map(t => ({ title: { contains: t } }))
        },
        select: { id: true, slug: true, title: true }
    });

    console.log(JSON.stringify(prayers, null, 2));
}

checkMore()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
