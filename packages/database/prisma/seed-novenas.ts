import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const NOVENAS = [
    {
        name: "Novena to St. Jude",
        slug: "st-jude",
        description: "For desperate cases and lost causes.",
        dayOneText: "St. Jude, glorious Apostle, faithful servant and friend of Jesus, the name of the traitor has caused you to be forgotten by many, but the Church honors and invokes you universally as the patron of difficult cases, and of things almost despaired of.",
    },
    {
        name: "Novena to the Sacred Heart",
        slug: "sacred-heart",
        description: "Trust in the infinite mercy and love of Jesus.",
        dayOneText: "O my Jesus, you have said: 'Truly I say to you, ask and you will receive, seek and you will find, knock and it will be opened to you.' Behold I knock, I seek and ask for the grace of...",
    },
    {
        name: "Novena to the Divine Mercy",
        slug: "divine-mercy",
        description: "Given by Jesus to St. Faustina for the salvation of souls.",
        dayOneText: "\"Today bring to Me all mankind, especially all sinners, and immerse them in the ocean of My mercy.\"",
    },
    {
        name: "Novena to St. Joseph",
        slug: "st-joseph",
        description: "For fathers, workers, and a happy death.",
        dayOneText: "Oh, St. Joseph, whose protection is so great, so strong, so prompt before the throne of God. I place in you all my interests and desires.",
    },
    {
        name: "Novena to Our Lady of Perpetual Help",
        slug: "perpetual-help",
        description: "Seeking the intercession of our Blessed Mother.",
        dayOneText: "O Mother of Perpetual Help, with the greatest confidence we come before your holy picture to be inspired by the example of your life.",
    },
    {
        name: "Novena to the Holy Spirit",
        slug: "holy-spirit",
        description: "For the seven gifts of the Holy Spirit.",
        dayOneText: "Come Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.",
    },
    {
        name: "Novena to St. Anthony",
        slug: "st-anthony",
        description: "For lost items and miracles.",
        dayOneText: "O Holy St. Anthony, gentlest of Saints, your love for God and Charity for his creatures made you worthy to possess miraculous powers.",
    },
    {
        name: "Novena to St. Therese of Lisieux",
        slug: "st-therese",
        description: "The Little Flower, for faith and simplicity.",
        dayOneText: "O Little Therese of the Child Jesus, please pick for me a rose from the heavenly gardens and send it to me as a message of love.",
    },
    {
        name: "Novena to St. Michael the Archangel",
        slug: "st-michael",
        description: "For protection against evil.",
        dayOneText: "St. Michael the Archangel, defend us in battle, be our protection against the wickedness and snares of the devil.",
    },
    {
        name: "Novena to Our Lady of Lourdes",
        slug: "lourdes",
        description: "For healing of body and soul.",
        dayOneText: "O ever immaculate Virgin, Mother of Mercy, Health of the Sick, Refuge of Sinners, Comfortess of the Afflicted, you know my wants, my troubles, my sufferings.",
    },
    {
        name: "Novena to St. Peregrine",
        slug: "st-peregrine",
        description: "Patron saint of cancer patients.",
        dayOneText: "O great St. Peregrine, you have been called 'The Mighty', for the numerous miracles which you have obtained from God for those who have had recourse to you.",
    },
    {
        name: "Novena to St. Francis of Assisi",
        slug: "st-francis",
        description: "For peace and love of creation.",
        dayOneText: "Lord, make me an instrument of your peace. Where there is hatred, let me sow love.",
    },
    {
        name: "Novena to St. Padre Pio",
        slug: "padre-pio",
        description: "For healing and spiritual guidance.",
        dayOneText: "Beloved Padre Pio, Saint of Pietrelcina, you bore the wounds of our Lord Jesus Christ on your body.",
    },
    {
        name: "Novena to St. Benedict",
        slug: "st-benedict",
        description: "For protection against spiritual attacks.",
        dayOneText: "Glorious St. Benedict, sublime model of sanctity, pure vessel of God's grace! Behold me humbly kneeling at your feet.",
    },
    {
        name: "Novena to St. Rita",
        slug: "st-rita",
        description: "Patroness of impossible causes.",
        dayOneText: "O powerful St. Rita, rightly called Saint of the Impossible, I come to you with confidence in my great need.",
    },
    {
        name: "Novena to the Immaculate Conception",
        slug: "immaculate-conception",
        description: "Honoring Mary's purity.",
        dayOneText: "O God, who by the Immaculate Conception of the Virgin, didst prepare a worthy dwelling place for Thy Son.",
    },
    {
        name: "Novena to St. Patrick",
        slug: "st-patrick",
        description: "For faith and missionary zeal.",
        dayOneText: "O great Apostle of Ireland, glorious St. Patrick, to whom under God, so many are indebted for the most precious of all treasures, the gift of Faith.",
    },
    {
        name: "Novena to St. Monica",
        slug: "st-monica",
        description: "For mothers and conversion of children.",
        dayOneText: "Exemplary Mother of the Great Augustine, you perseveringly pursued your wayward son with pious tears.",
    },
    {
        name: "Novena to St. Anne",
        slug: "st-anne",
        description: "For grandmothers and families.",
        dayOneText: "Good St. Anne, you were especially favored by God to be the mother of the most holy Virgin Mary.",
    },
    {
        name: "Surrender Novena",
        slug: "surrender",
        description: "\"O Jesus, I surrender myself to you, take care of everything!\"",
        dayOneText: "Why do you confuse yourselves by worrying? Leave the care of your affairs to Me and everything will be peaceful.",
    },
    {
        name: "Novena to St. Philomena",
        slug: "st-philomena",
        description: "Powerful virgin martyr and wonder-worker.",
        dayOneText: "We beseech Thee, O Lord, to grant us the pardon of our sins by the intercession of Saint Philomena, virgin and martyr.",
    },
    {
        name: "Novena to St. Maximilian Kolbe",
        slug: "st-maximilian",
        description: "For prisoners and the pro-life movement.",
        dayOneText: "St. Maximilian Kolbe, faithful follower of St. Francis, inflamed by the love of God you spent your life in the service of the Immaculate Virgin.",
    },
    {
        name: "Novena to St. John Paul II",
        slug: "st-jp2",
        description: "For youth and families.",
        dayOneText: "O Holy Trinity, we thank you for having given to the Church Pope John Paul II, and for having made him shine with your fatherly tenderness.",
    },
    {
        name: "Novena to Our Lady of Guadalupe",
        slug: "guadalupe",
        description: "Patroness of the Americas and Unborn.",
        dayOneText: "O Our Lady of Guadalupe, mystical rose, make intercession for the Holy Church, protect the Sovereign Pontiff, help all those who invoke thee in their necessities.",
    },
    {
        name: "Christmas Novena",
        slug: "christmas",
        description: "Preparing for the birth of Jesus.",
        dayOneText: "Hail and blessed be the hour and moment in which the Son of God was born of the most pure Virgin Mary, at midnight, in Bethlehem, in piercing cold.",
    }
];

async function main() {
    console.log(`Start seeding ${NOVENAS.length} novenas...`);

    for (const novena of NOVENAS) {
        // Create full 9-day text (simulated for now, would be full text in prod)
        const commonPrayer = "\n\n(Recite 1 Our Father, 1 Hail Mary, 1 Glory Be)";

        await prisma.novena.upsert({
            where: { slug: novena.slug },
            update: {
                name: novena.name,
                description: novena.description,
                // Update day texts just in case we change them
            },
            create: {
                name: novena.name,
                slug: novena.slug,
                description: novena.description,
                imageUrl: `https://myprayertower.com/assets/novenas/${novena.slug}.jpg`, // Placeholder
                // Simulating 9 distinct days based on day 1 logic
                dayOneText: novena.dayOneText + commonPrayer,
                dayTwoText: novena.dayOneText.split('.')[0] + "... (Day 2 Reflection)" + commonPrayer,
                dayThreeText: novena.dayOneText.split('.')[0] + "... (Day 3 Reflection)" + commonPrayer,
                dayFourText: novena.dayOneText.split('.')[0] + "... (Day 4 Reflection)" + commonPrayer,
                dayFiveText: novena.dayOneText.split('.')[0] + "... (Day 5 Reflection)" + commonPrayer,
                daySixText: novena.dayOneText.split('.')[0] + "... (Day 6 Reflection)" + commonPrayer,
                daySevenText: novena.dayOneText.split('.')[0] + "... (Day 7 Reflection)" + commonPrayer,
                dayEightText: novena.dayOneText.split('.')[0] + "... (Day 8 Reflection)" + commonPrayer,
                dayNineText: novena.dayOneText.split('.')[0] + "... (Day 9 Reflection)" + commonPrayer,
            },
        });
        console.log(`Upserted: ${novena.name}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
