'use client';

import { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, BookOpen, Share2, Heart } from 'lucide-react';
import Link from 'next/link';

// Saints database matching seed data
const saintsDatabase: Record<string, any> = {
    '1': {
        name: 'St. Stephen',
        title: 'First Martyr, Deacon',
        feastDay: 'December 26',
        birthYear: '5 AD',
        deathYear: '34 AD',
        patronOf: ['Deacons', 'Stonemasons', 'Headaches'],
        biography: `St. Stephen was a deacon in the early Christian Church and is venerated as the first Christian martyr (protomartyr). He was stoned to death for his faith around 34 AD in Jerusalem.

Stephen was one of the seven deacons chosen by the Apostles to care for the poor and distribute food to the needy. He was known for his wisdom, faith, and the miracles he performed.

The Acts of the Apostles describes Stephen as "a man full of faith and of the Holy Spirit" and records his powerful speech before the Sanhedrin, in which he recounted the history of Israel and accused the Jewish leaders of resisting the Holy Spirit and killing the prophets.

When the crowd became enraged, Stephen looked up to heaven and said, "I see the heavens opened and the Son of Man standing at the right hand of God." He was then dragged out of the city and stoned. As he died, he prayed, "Lord Jesus, receive my spirit" and "Lord, do not hold this sin against them."

Among those present at his stoning was Saul of Tarsus, who later became St. Paul the Apostle.`,
        prayer: `Lord, grant that we may imitate the virtue of Saint Stephen, your first martyr, who even prayed for his persecutors. Help us to love our enemies and to seek the good of all people. Through Christ our Lord. Amen.`,
        relatedSaints: ['2', '3', '4'],
    },
    '2': {
        name: 'St. John the Apostle',
        title: 'Apostle and Evangelist',
        feastDay: 'December 27',
        birthYear: '6 AD',
        deathYear: '100 AD',
        patronOf: ['Authors', 'Publishers', 'Theologians', 'Loyalty'],
        biography: `St. John was one of the Twelve Apostles of Jesus Christ. Known as "the disciple whom Jesus loved," he was the only apostle present at the Crucifixion, where Jesus entrusted his mother Mary to John's care.

John was the son of Zebedee and Salome, and the brother of James the Great. Together with Peter and James, he formed the inner circle of disciples who witnessed key events including the Transfiguration and Jesus's agony in the Garden of Gethsemane.

Tradition identifies John as the author of the Gospel of John, three Epistles of John, and the Book of Revelation. His Gospel, written last of the four, is noted for its theological depth and emphasis on Jesus as the Word made flesh.

After Pentecost, John remained in Jerusalem before eventually settling in Ephesus. He is the only apostle traditionally believed to have died of natural causes in old age.`,
        prayer: `Almighty God, who through Your apostle John has given us the testimony of Your eternal Word: Grant that we, who have received this good news, may ever more come to know the glory of Your Son, Jesus Christ our Lord. Amen.`,
        relatedSaints: ['1', '3', '5'],
    },
    '3': {
        name: 'Holy Innocents',
        title: 'Martyrs',
        feastDay: 'December 28',
        birthYear: '-- AD',
        deathYear: '2 AD',
        patronOf: ['Babies', 'Children', 'Foundlings', 'Choir Singers'],
        biography: `The Holy Innocents were the young children of Bethlehem killed by King Herod the Great in his attempt to kill the infant Jesus, as recounted in the Gospel of Matthew.

After the Magi visited Jesus and departed without revealing his location to Herod, the king ordered the massacre of all male children in Bethlehem and its vicinity who were two years old and under.

The Holy Family had already fled to Egypt, having been warned by an angel in a dream. The children who died in Herod's massacre are venerated as martyrs—the first to die for Christ, even though they did not consciously know him.

The Feast of the Holy Innocents has been observed since at least the 5th century and reminds the Church of the vulnerability of the innocent and the cost of evil in the world.`,
        prayer: `O God, whose praise the Holy Innocents did this day proclaim, not by speaking but by dying: Destroy in us all the wickedness of evil, that our lives may also proclaim Your faith, which our tongues profess. Through Christ our Lord. Amen.`,
        relatedSaints: ['1', '4', '5'],
    },
    '4': {
        name: 'St. Thomas Becket',
        title: 'Bishop and Martyr',
        feastDay: 'December 29',
        birthYear: '1118',
        deathYear: '1170',
        patronOf: ['Clergy', 'Secular Clergy', 'Exeter College Oxford'],
        biography: `St. Thomas Becket was Archbishop of Canterbury from 1162 until his murder in 1170. His conflict with King Henry II over the rights and privileges of the Church led to his assassination by four knights in Canterbury Cathedral.

Born in London, Thomas served as Lord Chancellor of England before becoming archbishop. As chancellor, he was a close friend of King Henry II, but their relationship soured when Thomas began defending the Church's independence from royal authority.

After years of conflict and a six-year exile in France, Thomas returned to England in 1170. Shortly after, four knights, believing they were acting on the king's wishes, entered Canterbury Cathedral during vespers and killed Thomas before the altar.

Thomas was canonized just three years after his death, and his shrine at Canterbury became one of the most important pilgrimage sites in medieval England, famously depicted in Chaucer's "Canterbury Tales."`,
        prayer: `O God, for the sake of whose Church the glorious Bishop Thomas fell by the swords of wicked men: Grant, we beseech You, that all who implore his aid may find what they seek. Through Christ our Lord. Amen.`,
        relatedSaints: ['1', '5', '6'],
    },
    '5': {
        name: 'Holy Family',
        title: 'Jesus, Mary, and Joseph',
        feastDay: 'Sunday after Christmas',
        birthYear: '--',
        deathYear: '--',
        patronOf: ['Families', 'Christian Parents', 'Family Life'],
        biography: `The Feast of the Holy Family celebrates the family of Jesus, Mary, and Joseph and their exemplary life together in Nazareth.

The Holy Family is held up as the model for Christian family life. Despite the extraordinary circumstances surrounding Jesus's birth and mission, the family lived in humble, ordinary circumstances—Joseph as a carpenter, Mary as a homemaker, and Jesus growing "in wisdom and stature."

The Scriptures give us glimpses of family events: the Presentation in the Temple, the Flight into Egypt, and the finding of Jesus in the Temple at age twelve. Throughout, the Holy Family demonstrates faith, obedience to God, love for one another, and trust in Divine Providence.

The feast was established by Pope Leo XIII in 1893 and is celebrated on the Sunday within the Octave of Christmas.`,
        prayer: `Lord God, in the Holy Family You have given us a true model of life lived in the home. Help us, through their intercession, to live in faith and love, and share in the eternal life of heaven. We ask this through Christ our Lord. Amen.`,
        relatedSaints: ['6', '7', '8'],
    },
    '6': {
        name: 'St. Sylvester I',
        title: 'Pope',
        feastDay: 'December 31',
        birthYear: '? AD',
        deathYear: '335',
        patronOf: ['Masons', 'New Years Eve'],
        biography: `Pope Sylvester I was the 33rd Pope, reigning from 314 to 335. His pontificate coincided with the reign of Emperor Constantine the Great, who ended the persecution of Christians and made Christianity legal in the Roman Empire.

During Sylvester's pontificate, the First Council of Nicaea was held in 325, which formulated the Nicene Creed and addressed the Arian heresy. Although Sylvester did not attend personally, he sent legates to represent him.

Constantine built several great basilicas in Rome during Sylvester's papacy, including the original St. Peter's Basilica, the Lateran Basilica, and the Church of the Holy Sepulchre in Jerusalem.

The legendary "Donation of Constantine," a famous medieval forgery, claimed that Constantine granted Pope Sylvester temporal authority over Rome and the Western Roman Empire.`,
        prayer: `O God, come to the help of Your people who invoke the intercession of blessed Sylvester, Your Confessor and Bishop, that they may be enabled to serve You with free minds. Through Christ our Lord. Amen.`,
        relatedSaints: ['4', '5', '7'],
    },
    '7': {
        name: 'Mary, Mother of God',
        title: 'Solemnity',
        feastDay: 'January 1',
        birthYear: '18 BC',
        deathYear: '? AD',
        patronOf: ['Mothers', 'All People', 'The Church'],
        biography: `The Solemnity of Mary, the Holy Mother of God, celebrated on January 1, commemorates Mary's role as Theotokos (God-bearer) and her divine motherhood.

This is the oldest Marian feast in the Western Church, dating back to the 4th century. It celebrates the most fundamental of all Mary's titles—that she is truly the Mother of God, not merely the mother of a human being who was later joined to the divine.

The Council of Ephesus in 431 formally declared this doctrine in response to Nestorius, who had denied that Mary could be called "Theotokos." The Council affirmed that in Jesus Christ, divine and human natures are united in one person, and therefore Mary, as his mother, is rightly called the Mother of God.

The feast falls on the Octave Day of Christmas, emphasizing the intimate connection between the Nativity and Mary's motherhood.`,
        prayer: `O God, who through the fruitful virginity of Blessed Mary bestowed on the human race the grace of eternal salvation, grant that we may experience the intercession of her, through whom we were made worthy to receive the Author of Life. Amen.`,
        relatedSaints: ['5', '8', '9'],
    },
    '8': {
        name: 'St. Basil the Great',
        title: 'Bishop and Doctor of the Church',
        feastDay: 'January 2',
        birthYear: '330',
        deathYear: '379',
        patronOf: ['Hospital Administrators', 'Monasticism', 'Reformers', 'Russia'],
        biography: `St. Basil the Great was a Greek bishop of Caesarea in Cappadocia and one of the most influential theologians of the 4th century. He defended the Church against Arianism and helped shape Eastern Christian monasticism.

Basil came from a remarkable family of saints: his grandmother, parents, two brothers, and one sister are all venerated as saints. He was educated in Constantinople and Athens, where he met Gregory Nazianzen, who became his lifelong friend.

After his baptism, Basil renounced his career and founded a monastic community in Pontus. His monastic rules, emphasizing community life, prayer, and charitable work, remain foundational for Eastern monasticism today.

As Bishop of Caesarea, Basil combated Arianism, organized charitable institutions, reformed the liturgy, and composed influential theological works. His Divine Liturgy is still used in Eastern Churches.`,
        prayer: `O God, You were pleased to give light to Your Church by the life and doctrine of St. Basil the Great: Grant that we may humbly learn Your truth and faithfully practice it in charity. Through Christ our Lord. Amen.`,
        relatedSaints: ['6', '7', '9'],
    },
};

// Helper to get related saints
function getRelatedSaints(saintId: string) {
    const saint = saintsDatabase[saintId];
    if (!saint?.relatedSaints) return [];
    return saint.relatedSaints.map((id: string) => ({
        id,
        name: saintsDatabase[id]?.name || 'Unknown Saint',
        title: saintsDatabase[id]?.title || '',
    }));
}

export default function SaintDetailPage({ params }: { params: { id: string } }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const saint = saintsDatabase[params.id];
    const relatedSaints = getRelatedSaints(params.id);

    if (!saint) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Saint Not Found</h1>
                    <p className="text-gray-500 mb-6">The saint you're looking for doesn't exist in our database.</p>
                    <Link href="/saints" className="text-amber-600 hover:underline">
                        ← Back to Saints Calendar
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-12 text-white">
                <div className="container mx-auto px-4">
                    <Link href="/saints" className="inline-flex items-center gap-2 text-amber-200 hover:text-white mb-4">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Saints Calendar
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center text-6xl">
                            👼
                        </div>
                        <div className="flex-1">
                            <p className="text-amber-200 mb-1">{saint.title}</p>
                            <h1 className="text-4xl font-bold mb-2">{saint.name}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-amber-100">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>Feast Day: {saint.feastDay}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{saint.birthYear} - {saint.deathYear}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-3 rounded-xl ${isFavorite ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white/30'}`}
                            >
                                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : ''}`} />
                            </button>
                            <button className="p-3 bg-white/20 text-white hover:bg-white/30 rounded-xl">
                                <Share2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Biography */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-amber-600" />
                                Biography
                            </h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {saint.biography}
                            </div>
                        </div>

                        {/* Prayer */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <h2 className="text-xl font-bold text-amber-800 mb-4">🙏 Prayer to {saint.name}</h2>
                            <p className="text-amber-900 italic leading-relaxed">{saint.prayer}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Patron Of */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Patron Saint Of</h3>
                            <div className="flex flex-wrap gap-2">
                                {saint.patronOf.map((patron: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                        {patron}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Quick Facts</h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm text-gray-500">Feast Day</dt>
                                    <dd className="font-medium text-gray-900">{saint.feastDay}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Born</dt>
                                    <dd className="font-medium text-gray-900">{saint.birthYear}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Died</dt>
                                    <dd className="font-medium text-gray-900">{saint.deathYear}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Title</dt>
                                    <dd className="font-medium text-gray-900">{saint.title}</dd>
                                </div>
                            </dl>
                        </div>

                        {/* Related Saints */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Related Saints</h3>
                            <div className="space-y-3">
                                {relatedSaints.map((related: any) => (
                                    <Link
                                        key={related.id}
                                        href={`/saints/${related.id}`}
                                        className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <p className="font-medium text-gray-900">{related.name}</p>
                                        <p className="text-sm text-gray-500">{related.title}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
