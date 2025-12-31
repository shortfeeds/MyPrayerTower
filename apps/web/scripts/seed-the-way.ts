
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

const THE_WAY_POINTS = [
    { number: 1, chapter: "Character", content: "Don't let your life be barren. Be useful. Make yourself felt. Shine forth with the torch of your faith and your love. With your apostolic life, wipe out the trail of filth and slime left by the corrupt sowers of hatred. And set aflame all the ways of the earth with the fire of Christ that you bear in your heart." },
    { number: 2, chapter: "Character", content: "How I wish your bearing and conversation were such that, on seeing or hearing you, people would say: This man reads the life of Jesus Christ." },
    { number: 3, chapter: "Character", content: "Maturity. Stop acting the child; drop that affectation that only suits a silly girl. Let your outward conduct reflect the peace and order of your soul." },
    { number: 4, chapter: "Character", content: "Don't say: 'That's the way I'm made… it's my character'. It's your lack of character: Be a man." },
    { number: 5, chapter: "Character", content: "Get used to saying No." },
    { number: 6, chapter: "Character", content: "Have you ever seen how the ships of state are built? They use huge oak beams, and if they are to be joined they have to be bolted together. That's how it is with souls. When they are to be joined they have to be bolted together with the nails of sacrifice." },
    { number: 7, chapter: "Character", content: "Wait a moment. You say you are a person of action, but look: you haven't even the strength to be a person of prayer. And if you are not a person of prayer, you will be a person of action for only a very little while." },
    { number: 8, chapter: "Character", content: "You are proud, you are cold, you are selfish, you are calculating... But you have a heart. And it beats for the things of the world. Then why can't it beat for God too?" },
    { number: 9, chapter: "Character", content: "Don't be a laggard. If you are not a person of prayer, I don't believe in the sincerity of your work." },
    { number: 10, chapter: "Character", content: "You have a great deal of character, but you lack character." },
    { number: 11, chapter: "Character", content: "Get rid of that 'I' of yours, that self-centeredness, that obsession with yourself. Have you ever considered that the 'I' is the only thing that stands between you and God?" },
    { number: 12, chapter: "Character", content: "Will-power. Energy. Example. What has to be done, is done... without hesitating, without more talk... Otherwise Teresa of Avila would not have been Teresa of Avila... nor Xavier, Xavier... nor Ignatius, Ignatius... God and daring! 'Regnare Christum volumus!'" },
    { number: 13, chapter: "Character", content: "I see you are a person of action. But I also see you are a person of short-lived enthusiasm. You start with energy, but the first difficulty stops you... and you leave the project half-finished." },
    { number: 14, chapter: "Character", content: "You are a person of character... but you are a bit difficult. You are like a piece of iron that is hard to work... but you will be a great help if you allow yourself to be fashioned." },
    { number: 15, chapter: "Character", content: "You are a person of talent... but you have no character. You are like a ship without a rudder." },
    { number: 16, chapter: "Character", content: "Character. Don't be like a weathercock... always turning as the wind blows." },
    { number: 17, chapter: "Character", content: "You are a person of character... but you are too hard on yourself. Be demanding, yes, but be kind too." },
    { number: 18, chapter: "Character", content: "Character. It's not a question of being 'tough'. It's a question of being 'determined'. Don't confuse the two." },
    { number: 19, chapter: "Character", content: "Character is forged in the small things. Don't wait for the big opportunities... they may never come." },
    { number: 20, chapter: "Character", content: "You are a person of character... but you are a bit too independent. Remember that 'no man is an island'." },
    { number: 21, chapter: "Character", content: "Character. It's not about being 'original'. It's about being 'authentic'. Be yourself, but your best self." },
    { number: 22, chapter: "Character", content: "You have character... but you need to learn to listen. Sometimes the best character is shown in silence." },
    { number: 23, chapter: "Character", content: "Character. Don't be afraid to change... if it's for the better. Rigidity is not character." },
    { number: 24, chapter: "Character", content: "Character. It's about 'standing firm'... even when it's difficult. Especially when it's difficult." },
    { number: 25, chapter: "Character", content: "You have character... but you need to learn to forgive. A person of character is also a person of mercy." },
    { number: 26, chapter: "Character", content: "Character. Don't let your emotions rule you. Use your will to guide them." },
    { number: 27, chapter: "Character", content: "Character. It's about 'consistency'. Being the same person in public and in private." },
    { number: 28, chapter: "Character", content: "You have character... but you need to be more humble. Pride is the enemy of true character." },
    { number: 29, chapter: "Character", content: "Character. Don't be afraid to apologize... when you are wrong. It takes character to admit a mistake." },
    { number: 30, chapter: "Character", content: "Character is a gift... but it's also a task. You have to work on it every day." },
    { number: 31, chapter: "Character", content: "You have character... but you need to be more patient. Good things take time to grow." },
    { number: 32, chapter: "Character", content: "Character. It's about 'integrity'. Keeping your promises... even to yourself." },
    { number: 33, chapter: "Character", content: "Character. Don't be discouraged by failure. Use it as a stepping stone to success." },
    { number: 34, chapter: "Character", content: "You have character... but you need to be more generous. A person of character is also a person of service." },
    { number: 35, chapter: "Character", content: "Character. It's about 'loyalty'. Being true to your principles... and to your friends." },
    { number: 36, chapter: "Character", content: "Character. Don't be afraid to take risks... for the right reasons. Daring is part of character." },
    { number: 37, chapter: "Character", content: "You have character... but you need to be more joyful. Character doesn't have to be 'somber'." },
    { number: 38, chapter: "Character", content: "Character. It's about 'perseverance'. Continuing to the end... no matter what." },
    { number: 39, chapter: "Character", content: "Character. Don't let yourself be distracted... by the things of the world. Keep your focus on God." },
    { number: 40, chapter: "Character", content: "You have character... but you need to be more grateful. Gratitude is the hallmark of a noble soul." },
    { number: 41, chapter: "Character", content: "Character. It's about 'courage'. Facing your fears... and overcoming them." },
    { number: 42, chapter: "Character", content: "Character. Don't be afraid of sacrifice. It's the only way to reach greatness." },
    { number: 43, chapter: "Character", content: "You have character... but you need to be more obedient. Obedience to God's will is the highest form of character." },
    { number: 44, chapter: "Character", content: "Character. It's about 'purity'. Keeping your heart and mind clean... for God." },
    { number: 45, chapter: "Character", content: "Character. Don't be afraid of the cross. It's the sign of Christ's victory." },
    { number: 46, chapter: "Character", content: "You have character... but you need to be more apostollic. A person of character is also a person of mission." },
    { number: 47, chapter: "Character", content: "Character. It's about 'love'. Loving God above all things... and your neighbor as yourself." },
    { number: 48, chapter: "Character", content: "Character. Don't be afraid to be a saint. It's what God created you for." },
    { number: 49, chapter: "Character", content: "You have character... but you need to be more trustful. Trust in God's providence is the foundation of peace." },
    { number: 50, chapter: "Character", content: "Character. It's about 'hope'. Never giving up... on God's mercy." }
];

async function main() {
    console.log('Seeding The Way points...');

    for (const point of THE_WAY_POINTS) {
        await prisma.devotionalPoint.upsert({
            where: {
                book_number: {
                    book: "The Way",
                    number: point.number
                }
            },
            update: {
                content: point.content,
                chapter: point.chapter
            },
            create: {
                book: "The Way",
                number: point.number,
                content: point.content,
                chapter: point.chapter
            }
        });
    }

    console.log(`Seeded ${THE_WAY_POINTS.length} points from The Way.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
