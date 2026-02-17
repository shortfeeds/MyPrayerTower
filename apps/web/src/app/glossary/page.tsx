'use client';

import { useState } from 'react';
import { BookA, Search, ChevronDown } from 'lucide-react';
import { SmartAdSlot } from '@/components/ads/SmartAdSlot';

interface Term {
    term: string;
    definition: string;
    category: string;
}

const GLOSSARY: Term[] = [
    // Sacraments (20)
    { term: 'Absolution', definition: 'The act of a priest forgiving sins in the Sacrament of Reconciliation.', category: 'Sacraments' },
    { term: 'Anointing of the Sick', definition: 'Sacrament for physical and spiritual healing, formerly called Last Rites or Extreme Unction.', category: 'Sacraments' },
    { term: 'Baptism', definition: 'The first sacrament, which cleanses from sin and makes one a child of God and member of the Church.', category: 'Sacraments' },
    { term: 'Catechumen', definition: 'A person preparing to receive Baptism through the RCIA process.', category: 'Sacraments' },
    { term: 'Chrism', definition: 'Consecrated oil used in Baptism, Confirmation, and Holy Orders.', category: 'Sacraments' },
    { term: 'Communion', definition: 'Receiving the consecrated Body and Blood of Christ in the Eucharist.', category: 'Sacraments' },
    { term: 'Confirmation', definition: 'Sacrament that strengthens the grace of Baptism and seals one with the Holy Spirit.', category: 'Sacraments' },
    { term: 'Contrition', definition: 'Sorrow for sins committed, with the intention to avoid future sin.', category: 'Sacraments' },
    { term: 'Eucharist', definition: 'The sacrament of Christ\'s Body and Blood under the forms of bread and wine.', category: 'Sacraments' },
    { term: 'First Communion', definition: 'The first time a baptized person receives the Eucharist, usually around age 7-8.', category: 'Sacraments' },
    { term: 'Holy Orders', definition: 'Sacrament by which a man is ordained deacon, priest, or bishop.', category: 'Sacraments' },
    { term: 'Matrimony', definition: 'The sacrament of marriage between a baptized man and woman.', category: 'Sacraments' },
    { term: 'Penance', definition: 'Acts performed to make amends for sin; also another name for Reconciliation.', category: 'Sacraments' },
    { term: 'Real Presence', definition: 'Christ\'s true presence in the Eucharist—body, blood, soul, and divinity.', category: 'Sacraments' },
    { term: 'Reconciliation', definition: 'The sacrament of forgiveness, also called Confession or Penance.', category: 'Sacraments' },
    { term: 'Sacrament', definition: 'An outward sign instituted by Christ that gives grace.', category: 'Sacraments' },
    { term: 'Sacramental', definition: 'Sacred sign (like holy water or blessed medals) that prepares one to receive grace.', category: 'Sacraments' },
    { term: 'Transubstantiation', definition: 'The change of bread and wine into Christ\'s Body and Blood at Mass.', category: 'Sacraments' },
    { term: 'Viaticum', definition: 'Holy Communion given to those in danger of death (Latin for "food for the journey").', category: 'Sacraments' },
    { term: 'Vows', definition: 'Sacred promises made to God, especially in religious life or marriage.', category: 'Sacraments' },

    // Theology (25)
    { term: 'Actual Grace', definition: 'God\'s intervention in a particular moment to help us choose good.', category: 'Theology' },
    { term: 'Charism', definition: 'A spiritual gift given by the Holy Spirit for the good of the Church.', category: 'Theology' },
    { term: 'Dogma', definition: 'A truth revealed by God and definitively taught by the Church.', category: 'Theology' },
    { term: 'Eschatology', definition: 'The study of the last things: death, judgment, heaven, and hell.', category: 'Theology' },
    { term: 'Grace', definition: 'The free and unmerited gift of God\'s life and assistance.', category: 'Theology' },
    { term: 'Incarnation', definition: 'The mystery of the Son of God becoming man in Jesus Christ.', category: 'Christology' },
    { term: 'Indulgence', definition: 'Remission of temporal punishment due to sin already forgiven.', category: 'Theology' },
    { term: 'Inspiration', definition: 'The divine influence on the human authors of Sacred Scripture.', category: 'Theology' },
    { term: 'Justification', definition: 'Being made righteous before God through faith and baptism.', category: 'Theology' },
    { term: 'Mortal Sin', definition: 'A grave sin that destroys sanctifying grace and separates us from God.', category: 'Theology' },
    { term: 'Original Sin', definition: 'The fallen state inherited from Adam and Eve\'s first sin.', category: 'Theology' },
    { term: 'Redemption', definition: 'Christ\'s saving work of freeing humanity from sin through His death.', category: 'Theology' },
    { term: 'Revelation', definition: 'God\'s self-disclosure to humanity through Scripture and Tradition.', category: 'Theology' },
    { term: 'Sacred Tradition', definition: 'The living transmission of the Gospel, handed down from the Apostles.', category: 'Theology' },
    { term: 'Salvation', definition: 'Deliverance from sin and its consequences through Christ.', category: 'Theology' },
    { term: 'Sanctification', definition: 'The process of becoming holy through God\'s grace.', category: 'Theology' },
    { term: 'Sanctifying Grace', definition: 'The permanent gift of God\'s life dwelling in the soul.', category: 'Theology' },
    { term: 'Trinity', definition: 'The one God in three Persons: Father, Son, and Holy Spirit.', category: 'Theology' },
    { term: 'Venial Sin', definition: 'A lesser sin that weakens but does not destroy our relationship with God.', category: 'Theology' },
    { term: 'Virtue', definition: 'A good habit that helps us live morally; theological virtues are faith, hope, and charity.', category: 'Theology' },
    { term: 'Beatific Vision', definition: 'The direct knowledge of God enjoyed by the blessed in heaven.', category: 'Eschatology' },
    { term: 'Hell', definition: 'Eternal separation from God for those who die in mortal sin.', category: 'Eschatology' },
    { term: 'Limbo', definition: 'A theological concept of a state for unbaptized souls (no longer officially taught).', category: 'Eschatology' },
    { term: 'Particular Judgment', definition: 'The judgment each person receives immediately after death.', category: 'Eschatology' },
    { term: 'Purgatory', definition: 'The state of purification after death before entering Heaven.', category: 'Eschatology' },

    // Liturgy (20)
    { term: 'Advent', definition: 'The four-week liturgical season of preparation before Christmas.', category: 'Liturgy' },
    { term: 'Alleluia', definition: 'Hebrew for "Praise God," sung before the Gospel (except during Lent).', category: 'Liturgy' },
    { term: 'Altar', definition: 'The table on which the Eucharistic sacrifice is offered.', category: 'Liturgy' },
    { term: 'Chalice', definition: 'The cup used to hold the consecrated wine (Christ\'s Blood) at Mass.', category: 'Liturgy' },
    { term: 'Ciborium', definition: 'A covered vessel used to hold consecrated hosts.', category: 'Liturgy' },
    { term: 'Easter Triduum', definition: 'The three holiest days: Holy Thursday, Good Friday, and Holy Saturday.', category: 'Liturgy' },
    { term: 'Exposition', definition: 'Placing the Blessed Sacrament in a monstrance for adoration.', category: 'Liturgy' },
    { term: 'Holy Week', definition: 'The week before Easter, beginning with Palm Sunday.', category: 'Liturgy' },
    { term: 'Lectionary', definition: 'The book containing Scripture readings for Mass.', category: 'Liturgy' },
    { term: 'Lent', definition: 'The 40-day season of penance preparing for Easter.', category: 'Liturgy' },
    { term: 'Liturgical Calendar', definition: 'The Church\'s yearly cycle of feasts and seasons.', category: 'Liturgy' },
    { term: 'Liturgy of the Hours', definition: 'The official daily prayer of the Church, also called the Divine Office.', category: 'Liturgy' },
    { term: 'Mass', definition: 'The Catholic celebration of the Eucharist.', category: 'Liturgy' },
    { term: 'Monstrance', definition: 'A sacred vessel used to display the Blessed Sacrament for adoration.', category: 'Liturgy' },
    { term: 'Ordinary Time', definition: 'The liturgical season outside Advent, Christmas, Lent, and Easter.', category: 'Liturgy' },
    { term: 'Paschal Mystery', definition: 'Christ\'s passion, death, resurrection, and ascension.', category: 'Liturgy' },
    { term: 'Paten', definition: 'The plate on which the host is placed during Mass.', category: 'Liturgy' },
    { term: 'Tabernacle', definition: 'The ornate box where the Blessed Sacrament is reserved.', category: 'Liturgy' },
    { term: 'Vestments', definition: 'The sacred garments worn by clergy during liturgical celebrations.', category: 'Liturgy' },
    { term: 'Vigil Mass', definition: 'A Mass celebrated the evening before a Sunday or holy day.', category: 'Liturgy' },

    // Hierarchy (15)
    { term: 'Apostolic Succession', definition: 'The unbroken line of bishops from the Apostles to the present.', category: 'Ecclesiology' },
    { term: 'Archbishop', definition: 'A bishop who leads an archdiocese, often a metropolitan see.', category: 'Hierarchy' },
    { term: 'Bishop', definition: 'A successor to the Apostles with the fullness of the sacrament of Holy Orders.', category: 'Hierarchy' },
    { term: 'Cardinal', definition: 'A senior bishop appointed by the Pope, eligible to elect a new Pope.', category: 'Hierarchy' },
    { term: 'Conclave', definition: 'The meeting of cardinals to elect a new pope.', category: 'Hierarchy' },
    { term: 'Deacon', definition: 'An ordained minister who assists priests and bishops.', category: 'Hierarchy' },
    { term: 'Diocese', definition: 'A territorial district under the care of a bishop.', category: 'Hierarchy' },
    { term: 'Encyclical', definition: 'A formal letter from the Pope addressed to the universal Church.', category: 'Hierarchy' },
    { term: 'Ex Cathedra', definition: 'When the Pope speaks with full papal authority on faith or morals (infallibly).', category: 'Hierarchy' },
    { term: 'Magisterium', definition: 'The teaching authority of the Church, exercised by the Pope and bishops.', category: 'Hierarchy' },
    { term: 'Parish', definition: 'A local Catholic community under the care of a pastor.', category: 'Hierarchy' },
    { term: 'Pope', definition: 'The Bishop of Rome and successor of St. Peter, head of the Catholic Church.', category: 'Hierarchy' },
    { term: 'Priest', definition: 'An ordained minister who celebrates Mass, hears confessions, and shepherds souls.', category: 'Hierarchy' },
    { term: 'Religious Order', definition: 'A community of men or women living under vows (poverty, chastity, obedience).', category: 'Hierarchy' },
    { term: 'Vatican', definition: 'The headquarters of the Catholic Church and residence of the Pope in Rome.', category: 'Hierarchy' },

    // Mariology (10)
    { term: 'Annunciation', definition: 'The angel Gabriel\'s announcement to Mary that she would bear Christ.', category: 'Mariology' },
    { term: 'Assumption', definition: 'The dogma that Mary was taken body and soul into heaven.', category: 'Mariology' },
    { term: 'Hail Mary', definition: 'The most common Catholic prayer to the Blessed Virgin Mary.', category: 'Devotion' },
    { term: 'Immaculate Conception', definition: 'The doctrine that Mary was conceived without original sin.', category: 'Mariology' },
    { term: 'Marian Apparition', definition: 'A reported supernatural appearance of the Virgin Mary (e.g., Lourdes, Fatima).', category: 'Mariology' },
    { term: 'Our Lady', definition: 'A title of honor for the Virgin Mary.', category: 'Mariology' },
    { term: 'Rosary', definition: 'A devotional prayer meditating on the mysteries of Christ through Mary.', category: 'Devotion' },
    { term: 'Theotokos', definition: 'Greek for "God-bearer," a title for Mary affirming Jesus\' divinity.', category: 'Mariology' },
    { term: 'Visitation', definition: 'Mary\'s visit to her cousin Elizabeth, where she proclaimed the Magnificat.', category: 'Mariology' },
    { term: 'Virgin Birth', definition: 'The doctrine that Jesus was conceived by the Holy Spirit without a human father.', category: 'Mariology' },

    // Devotion (15)
    { term: 'Adoration', definition: 'Prayer before the Blessed Sacrament, especially when exposed in a monstrance.', category: 'Devotion' },
    { term: 'Benediction', definition: 'A blessing with the Blessed Sacrament.', category: 'Devotion' },
    { term: 'Chaplet', definition: 'A set of prayer beads shorter than a rosary (e.g., Divine Mercy Chaplet).', category: 'Devotion' },
    { term: 'Divine Mercy', definition: 'A devotion centered on Christ\'s mercy, promoted by St. Faustina.', category: 'Devotion' },
    { term: 'Holy Hour', definition: 'An hour of prayer before the Blessed Sacrament.', category: 'Devotion' },
    { term: 'Litany', definition: 'A prayer of petition with repeated responses (e.g., Litany of the Saints).', category: 'Devotion' },
    { term: 'Novena', definition: 'A nine-day period of prayer for a special intention.', category: 'Devotion' },
    { term: 'Perpetual Adoration', definition: 'Continuous Eucharistic adoration by a community in shifts.', category: 'Devotion' },
    { term: 'Relic', definition: 'The physical remains or belongings of a saint, venerated by the faithful.', category: 'Saints' },
    { term: 'Sacred Heart', definition: 'Devotion to the love of Jesus symbolized by His physical heart.', category: 'Devotion' },
    { term: 'Scapular', definition: 'A devotional garment worn over the shoulders as a sign of consecration.', category: 'Devotion' },
    { term: 'Stations of the Cross', definition: 'A devotion following 14 moments of Christ\'s passion and death.', category: 'Devotion' },
    { term: 'Veneration', definition: 'Honor given to saints and sacred objects (not worship, which is for God alone).', category: 'Saints' },
    { term: 'Vigil Light', definition: 'A candle lit before a statue or icon as a prayer offering.', category: 'Devotion' },
    { term: 'Way of the Cross', definition: 'Another name for the Stations of the Cross.', category: 'Devotion' },

    // Saints (10)
    { term: 'Beatification', definition: 'The second step toward canonization, allowing public veneration.', category: 'Saints' },
    { term: 'Canonization', definition: 'The official declaration that a person is a saint in heaven.', category: 'Saints' },
    { term: 'Doctor of the Church', definition: 'A saint recognized for significant theological contribution.', category: 'Saints' },
    { term: 'Intercession', definition: 'Prayer on behalf of another; saints intercede for us before God.', category: 'Saints' },
    { term: 'Martyr', definition: 'One who dies for the faith rather than renounce Christ.', category: 'Saints' },
    { term: 'Patron Saint', definition: 'A saint who is a special protector of a person, place, or activity.', category: 'Saints' },
    { term: 'Servant of God', definition: 'The first step in canonization; a candidate for sainthood.', category: 'Saints' },
    { term: 'Stigmata', definition: 'The wounds of Christ miraculously appearing on a person\'s body.', category: 'Saints' },
    { term: 'Venerable', definition: 'Title given when heroic virtue is proven in the canonization process.', category: 'Saints' },
    { term: 'Virgin Martyr', definition: 'A female saint who died for the faith while maintaining consecrated virginity.', category: 'Saints' },

    // Scripture & Prayer (10)
    { term: 'Apostle', definition: 'One of the twelve chosen by Jesus, or a missionary sent to spread the Gospel.', category: 'Ecclesiology' },
    { term: 'Canon', definition: 'The official list of books in the Bible recognized by the Church.', category: 'Scripture' },
    { term: 'Deuterocanonical', definition: 'The seven books in the Catholic Bible not in most Protestant Bibles.', category: 'Scripture' },
    { term: 'Evangelization', definition: 'Proclaiming the Gospel and making disciples.', category: 'Ecclesiology' },
    { term: 'Gospel', definition: 'The Good News of Jesus Christ; the first four books of the New Testament.', category: 'Scripture' },
    { term: 'Homily', definition: 'The sermon given by the priest or deacon after the Gospel reading.', category: 'Liturgy' },
    { term: 'Intercession', definition: 'Prayer on behalf of another; saints intercede for us before God.', category: 'Devotion' },
    { term: 'Laity', definition: 'All the baptized faithful who are not clergy or religious.', category: 'Ecclesiology' },
    { term: 'Liturgy', definition: 'The official public worship of the Church.', category: 'Liturgy' },
    { term: 'Psalm', definition: 'A sacred song or hymn from the Book of Psalms in the Old Testament.', category: 'Scripture' },
];

const CATEGORIES = ['All', 'Sacraments', 'Theology', 'Hierarchy', 'Liturgy', 'Ecclesiology', 'Mariology', 'Christology', 'Eschatology', 'Devotion', 'Saints', 'Scripture'];

export default function GlossaryPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = GLOSSARY.filter(t => {
        const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
            t.definition.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || t.category === category;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-cyan-700 via-teal-800 to-emerald-900 text-white pt-28 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm mb-6">
                        <BookA className="w-4 h-4 text-cyan-300" />
                        <span>A-Z Reference</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Catholic Glossary</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto mb-10">
                        Definitions of key Catholic terms, doctrines, and concepts.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search terms..."
                            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-10 justify-center">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full font-medium transition-all ${category === cat
                                ? 'bg-cyan-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Terms */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {filtered.map(term => (
                        <div key={term.term} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{term.term}</h3>
                                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                                    {term.category}
                                </span>
                            </div>
                            <p className="text-gray-600">{term.definition}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom Ad */}
                <div className="max-w-3xl mx-auto mt-10">
                    <SmartAdSlot page="general" position="bottom" showPlaceholder={false} />
                </div>
            </div>
        </div>
    );
}
