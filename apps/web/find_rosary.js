
const { PrismaClient } = require('@mpt/database');
const prisma = new PrismaClient();

// Handle BigInt serialization
BigInt.prototype.toJSON = function () { return this.toString() }

async function findRosary() {
    const prayers = await prisma.prayer.findMany({
        where: {
            title: {
                contains: 'Rosary'
            }
        },
        select: { id: true, slug: true, title: true, is_active: true }
    });
    console.log('Rosary Prayers Found:', prayers.length);
    console.log(JSON.stringify(prayers, null, 2));
}

findRosary()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
