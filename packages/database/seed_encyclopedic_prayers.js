const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../../node_modules/@prisma/client'));
const prisma = new PrismaClient();

const ENCYCLOPEDIC_PRAYERS = [
  // =========================================================================
  // CONTINENT 1: ANCIENT ROOTS, PATRISTIC & BIBLICAL TREASURY
  // =========================================================================
  {
    title: "The Eucharistic Thanksgiving of the Didache (Teaching of the Twelve Apostles)",
    slug: "didache-eucharistic-thanksgiving",
    category: "historical",
    category_label: "Early Church & Ancient Roots",
    tags: ["tradition:early-church", "century:1st", "root:apostolic", "eucharist", "liturgy", "ancient"],
    content: `> 📜 **Historical & Biblical Origin**: The *Didache* (c. 70–110 AD) is the oldest surviving Christian document outside the New Testament, preserving the authentic liturgical prayers of the Apostolic generation immediately following Saints Peter and Paul.
> 🕯️ **Liturgical Setting & Posture**: Stand reverently with hands extended in the ancient *Orans* posture (palms upward), offering thanksgiving following the reception of Holy Communion or during Eucharistic Adoration.

We give thanks to Thee, our Father, for the Holy Vine of David Thy servant, which Thou hast made known to us through Jesus Thy Servant; to Thee be the glory for ever and ever.

Even as this broken bread was once scattered over the mountains, and being gathered together became one single loaf, so let Thy Church be gathered together from the ends of the earth into Thy kingdom; for Thine is the glory and the power through Jesus Christ for ever.

Thou, Almighty Master, didst create all things for Thy name's sake, and gavest food and drink to men for enjoyment, that they might give thanks to Thee; but to us Thou hast freely given spiritual food and drink and eternal life through Thy Servant.

Above all, we give thanks to Thee because Thou art mighty; remember, Lord, Thy Church, to deliver her from all evil and to perfect her in Thy love. Gather her together from the four winds, sanctified for Thy kingdom which Thou hast prepared for her; for Thine is the power and the glory for ever and ever.

Let grace come, and let this world pass away. Hosanna to the Son of David! If any man is holy, let him come; if any man is not, let him repent. Maranatha! Amen.`
  },
  {
    title: "The Jesus Prayer of the Desert Fathers (Hesychastic Breathing Prayer)",
    slug: "desert-fathers-jesus-prayer-hesychasm",
    category: "spiritual-warfare",
    category_label: "Desert Fathers & Contemplation",
    tags: ["tradition:desert-fathers", "century:4th", "hesychasm", "jesus-prayer", "peace", "contemplation", "mindfulness"],
    content: `> 📜 **Historical & Biblical Origin**: Practiced by the Desert Fathers of Egypt, Mount Sinai, and Mount Athos from the 3rd century onward (St. Anthony the Great, St. John Climacus), uniting Luke 18:13 and the Holy Name of Jesus (Philippians 2:9-10).
> 🕯️ **Instructions & Posture**: Sit in a quiet room with back straight. Close your eyes. Inhale gently through the nose while silently praying the first clause; exhale slowly while praying the second clause. Repeat continuously for 10 to 20 minutes to calm racing thoughts and center the soul in God's presence.

**Inhaling gently:**
"Lord Jesus Christ, Son of the Living God..."

**Exhaling slowly:**
"...have mercy on me, a sinner."

O Divine Physician of souls and bodies, who didst enter the silence of the wilderness to overcome the tempter, silence within my heart all clamor, anxiety, and worldly distraction. 

Let the Holy Name of Jesus be the rhythmic breath of my spirit, a fortress against every despairing thought, and an unquenchable flame of divine charity within my inner chamber. In waking and in sleeping, in labour and in rest, let my soul whisper without ceasing:

"Lord Jesus Christ, Son of God, have mercy on me, a sinner."

For at Thy Holy Name every knee shall bend, in heaven and on earth and under the earth, and every tongue confess that Jesus Christ is Lord, to the glory of God the Father. Amen.`
  },
  {
    title: "Lenten Prayer of Metanoia and Tears of St. Ephrem the Syrian",
    slug: "st-ephrem-lenten-prayer-metanoia",
    category: "repentance",
    category_label: "Early Church & Ancient Roots",
    tags: ["tradition:patristic", "century:4th", "lent", "repentance", "humility", "desert-fathers"],
    content: `> 📜 **Historical & Biblical Origin**: Composed by St. Ephrem the Syrian (306–373 AD), Doctor of the Church and deacon. Celebrated as the ultimate summary of Christian asceticism and heart-conversion (*metanoia*).
> 🕯️ **Liturgical Setting & Posture**: Traditionally accompanied by three deep prostrations (kneeling with forehead touching the ground) or profound bows from the waist. Recited throughout Great Lent and on Friday penance days.

O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk. *(Make a deep bow or prostration)*

But give rather the spirit of chastity, humility, patience, and love to Thy servant. *(Make a deep bow or prostration)*

Yea, O Lord and King, grant me to see mine own transgressions, and not to judge my brother; for blessed art Thou unto ages of ages. Amen. *(Make a deep bow or prostration)*

O God, cleanse me a sinner and have mercy on me. Cast me not away from Thy presence, and take not Thy Holy Spirit from me. Restore unto me the joy of Thy salvation, and uphold me with Thy free Spirit. Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "The Breastplate of St. Patrick (Complete Celtic Lorica of Divine Protection)",
    slug: "st-patrick-breastplate-lorica-protection",
    category: "protection",
    category_label: "Celtic Christianity & Protection",
    tags: ["tradition:celtic", "century:5th", "protection", "spiritual-warfare", "st-patrick", "armor-of-god"],
    content: `> 📜 **Historical & Biblical Origin**: The *Faeth Fiada* or *Lorica of St. Patrick* (5th Century), composed when the Apostle of Ireland confronted druidic spells and pagan ambush at the Hill of Tara. It binds the soul to the Holy Trinity and the Incarnation.
> 🕯️ **Liturgical Setting & Posture**: Stand facing the east with arms outstretched in the Sign of the Cross. Recite at dawn or before embarking upon dangerous journeys, confronting hostility, or undergoing spiritual warfare.

I arise today through a mighty strength, the invocation of the Trinity, through belief in the Threeness, through confession of the Oneness of the Creator of creation.

I arise today through the strength of Christ's birth with His baptism, through the strength of His crucifixion with His burial, through the strength of His resurrection with His ascension, through the strength of His descent for the judgment of doom.

I arise today through the strength of the love of cherubim, in the obedience of angels, in the service of archangels, in the hope of resurrection to meet with reward, in the prayers of patriarchs, in the predictions of prophets, in the preaching of apostles, in the faith of confessors, in the innocence of holy virgins, in the deeds of righteous men.

Christ with me, Christ before me, Christ behind me, 
Christ in me, Christ beneath me, Christ above me, 
Christ on my right, Christ on my left, 
Christ when I lie down, Christ when I sit down, Christ when I arise!

Christ in the heart of every man who thinks of me, 
Christ in the mouth of everyone who speaks of me, 
Christ in every eye that sees me, 
Christ in every ear that hears me.

Salvation is of the Lord. Salvation is of Christ. May Thy salvation, O Lord, be ever with us. Amen.`
  },
  {
    title: "Psalm 51: The Miserere (King David's Supreme Prayer of Heart-Repentance)",
    slug: "psalm-51-miserere-david-contrition",
    category: "repentance",
    category_label: "Biblical Roots & Psalter",
    tags: ["root:biblical", "psalms", "david", "repentance", "contrition", "mercy", "cleansing"],
    content: `> 📜 **Historical & Biblical Origin**: Psalm 51 (*Miserere mei, Deus*), written by King David after the prophet Nathan confronted him regarding his sin with Bathsheba (2 Samuel 12). It is the crown of the Church's Seven Penitential Psalms.
> 🕯️ **Liturgical Setting & Posture**: Kneel with head bowed, striking the breast three times at the words *"Against You only have I sinned."* Ideal before entering the confessional box or during times of deep personal regret.

Have mercy on me, O God, according to Thy steadfast love; according to Thy abundant mercy blot out my transgressions. Wash me thoroughly from my iniquity, and cleanse me from my sin!

For I know my transgressions, and my sin is ever before me. Against Thee, Thee only, have I sinned, and done that which is evil in Thy sight, so that Thou art justified in Thy sentence and blameless in Thy judgment.

Behold, Thou desirest truth in the inward being; therefore teach me wisdom in my secret heart. Purge me with hyssop, and I shall be clean; wash me, and I shall be whiter than snow. Let me hear joy and gladness; let the bones which Thou hast broken rejoice.

Hide Thy face from my sins, and blot out all my iniquities. Create in me a clean heart, O God, and put a new and right spirit within me. Cast me not away from Thy presence, and take not Thy Holy Spirit from me.

Restore to me the joy of Thy salvation, and uphold me with a willing spirit. Then I will teach transgressors Thy ways, and sinners will return to Thee.

The sacrifice acceptable to God is a broken spirit; a broken and contrite heart, O God, Thou wilt not despise. Amen.`
  },
  {
    title: "The Martyrdom Prayer of St. Polycarp of Smyrna (155 AD)",
    slug: "st-polycarp-martyrdom-prayer",
    category: "faith",
    category_label: "Early Church & Ancient Roots",
    tags: ["tradition:early-church", "century:2nd", "martyrdom", "faith", "sacrifice", "courage"],
    content: `> 📜 **Historical & Biblical Origin**: Recorded in *The Martyrdom of Polycarp* (155 AD). St. Polycarp, disciple of St. John the Evangelist and bishop of Smyrna, offered this prayer as he was tied to the pyre for refusing to curse Christ.
> 🕯️ **Instructions & Posture**: Look up toward Heaven with folded hands. Pray this during moments of intense testing, persecution, illness, or when facing the twilight of mortal life.

Lord God Almighty, Father of Thy beloved and blessed Son Jesus Christ, through whom we have received the knowledge of Thee, God of angels and powers and of the whole creation:

I bless Thee that Thou hast thought me worthy of this day and this hour, to take part in the number of Thy martyrs, in the cup of Thy Christ, unto the resurrection to eternal life, both of soul and body, in the incorruption of the Holy Spirit.

Among whom may I be accepted this day before Thee as a rich and acceptable sacrifice, just as Thou hast prepared and revealed beforehand, and now hast fulfilled, O true God in whom there is no falsehood.

For this cause, yea and for all things, I praise Thee, I bless Thee, I glorify Thee, through the eternal and heavenly High Priest, Jesus Christ, Thy beloved Son, through whom to Thee with Him and the Holy Spirit be glory both now and for the ages to come. Amen.`
  },

  // =========================================================================
  // CONTINENT 2: MEDICAL EMERGENCIES & HOSPITAL CRISES
  // =========================================================================
  {
    title: "Catholic Prayer on the Morning of Major Surgery",
    slug: "prayer-morning-of-major-surgery",
    category: "healing",
    category_label: "Crisis & Hospital Prayers",
    tags: ["occasion:surgery", "hospital", "healing", "doctors", "peace", "fear", "anesthesia"],
    content: `> 📜 **Scriptural Anchor**: *"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."* — Joshua 1:9
> 🕯️ **Liturgical Setting & Posture**: Pray while lying on the hospital bed or sitting in the pre-op staging room. Make a devout Sign of the Cross over your forehead, lips, and heart.

Lord Jesus Christ, Divine Physician and gentle Comforter of the afflicted, I place myself entirely into Thy merciful hands this morning. 

As I prepare to undergo this surgery, I surrender to Thee every anxiety, every fearful thought, and every uncertainty regarding the outcome. Thou art the Master of life and health; my body is Thy temple, and my life is held securely within Thy loving providence.

I pray for the surgeons, the anesthesiologist, the operating nurses, and all medical staff attending me today. Bless their minds with clarity, their eyes with precision, and their hands with skill and gentleness. May Thy Holy Spirit guide every incision, oversee every monitor, and protect me from all unexpected complications, infections, or excessive pain.

As anesthesia brings me into unconscious rest, let Thy Holy Guardian Angel stand watch over my soul. Keep my heart beating steadily according to Thy holy design, and grant that I may awake restored, with this sickness arrested and healing commenced.

Whether in health or in illness, in life or in death, I belong to Thee. Sacred Heart of Jesus, I place all my trust in Thee. Our Lady of Lourdes, health of the sick, pray for me. St. Luke and St. Raphael, guide the operating room. Amen.`
  },
  {
    title: "Prayer in the Intensive Care Waiting Room (ICU Vigil for a Loved One)",
    slug: "prayer-icu-waiting-room-critical-condition",
    category: "healing",
    category_label: "Crisis & Hospital Prayers",
    tags: ["occasion:icu", "hospital", "critical-condition", "family", "ventilator", "waiting", "mercy"],
    content: `> 📜 **Scriptural Anchor**: *"The Lord is close to the brokenhearted and saves those who are crushed in spirit."* — Psalm 34:18
> 🕯️ **Instructions & Posture**: Pray in the hospital chapel or waiting room chair. Hold a rosary or crucifix in hand, breathing deeply and slowly.

Father of mercies and God of all consolation, I come before Thee in this quiet hospital waiting room with a heart trembling with concern for my beloved *(mention name)*, who lies critically ill in the Intensive Care Unit.

Lord, Thou seest the monitors, the oxygen lines, the medicines, and the machines that sustain their fragile breath. Where human medicine reaches its limit, Thy divine power begins. Thou who didst raise Lazarus from the tomb and heal the centurion's servant with a single word, speak healing and restoration over their body right now.

Strengthen the critical care doctors, nurses, and specialists caring for them behind those closed doors. Grant them diagnostic insight, endurance during long shifts, and compassionate hearts. Protect my loved one from organ failure, arrest every infection, and bring stable breathing, calm vitals, and renewed strength to their weakened frame.

Grant to me and our family the grace of supernatural peace. Drive out panic, despair, and imagined worst-case fears. Remind us that no hospital door can lock Thee out, and that Thy Holy Spirit is beside their bedside even when visiting hours are closed.

Jesus, I trust in You. Jesus, I trust in You. Jesus, I trust in You. St. Jude, patron of desperate circumstances, intercede for us. Holy Family of Nazareth, shield our family. Amen.`
  },
  {
    title: "Prayer Upon Receiving a Serious Medical Diagnosis (Cancer & Chronic Illness)",
    slug: "prayer-serious-medical-diagnosis-cancer",
    category: "healing",
    category_label: "Crisis & Hospital Prayers",
    tags: ["occasion:diagnosis", "cancer", "chronic-illness", "strength", "hope", "st-peregrine"],
    content: `> 📜 **Scriptural Anchor**: *"He heals the brokenhearted and binds up their wounds."* — Psalm 147:3
> 🕯️ **Instructions**: Sit quietly before a crucifix or holy image. Recite this prayer when shock, numbness, or weeping overwhelms your spirit after receiving clinical test results.

Lord Jesus, my heart is shaken by the news I have received today. This diagnosis feels heavy, frightening, and overwhelming. The plans I had for tomorrow suddenly feel uncertain, and my spirit struggles to find footing on this unexpected cross.

Lord, in this moment of vulnerability, I anchor myself in Thee. Thou didst endure the bitter cup in Gethsemane; Thou knowest the chill of human anguish. Give me the grace not to look ahead into weeks and months with paralyzing fear, but to live this journey one day, one breath, and one prayer at a time.

I rebuke the spirit of despair, bitterness, and defeat in Thy Holy Name. If this trial is to be my path, grant me fortitude to fight with dignity and faith. Bless the oncologists and medical teams designing my treatment protocol. Make the therapies effective, minimize the side effects, and let every cancerous cell or diseased tissue be destroyed.

St. Peregrine, who wast miraculously healed of cancer through thy devotion to the Crucified Christ, walk beside me as my heavenly brother and advocate. Blessed Virgin Mary, wrap me in thy mantle of maternal tenderness. Lord, let Thy healing power permeate my bloodstream, my bones, and my mind. Jesus, Son of David, have mercy on me! Amen.`
  },
  {
    title: "Midnight Prayer Against Severe Anxiety, Panic Attacks & Insomnia",
    slug: "midnight-prayer-severe-anxiety-panic-insomnia",
    category: "peace",
    category_label: "Night & Mental Health Prayers",
    tags: ["occasion:insomnia", "panic-attack", "anxiety", "night", "racing-thoughts", "st-dymphna"],
    content: `> 📜 **Scriptural Anchor**: *"In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety."* — Psalm 4:8
> 🕯️ **Instructions & Posture**: Sit on the edge of the bed or lie flat with palms facing upward on your chest. Take five slow, deep breaths, visualizing Christ standing watch at the foot of your bed.

O Lord Jesus Christ, Prince of Peace, it is the dark of night and my mind is racing with racing thoughts, sudden tremors of panic, and irrational dread. The world around me sleeps, but my spirit feels agitated and trapped in a tempest.

Thou who didst rebuke the raging winds and howling waves on the Sea of Galilee with the words: *"Peace, be still!"* — speak that same sovereign peace into my nervous system, my chest, and my mind right now.

I command every spirit of fear, nocturnal terror, and runaway dread to leave my presence in the mighty Name of Jesus Christ. I cast every burden, every tomorrow, every financial worry, and every unspoken dread at the foot of Thy Holy Cross. I cannot carry tomorrow tonight; Thou art already standing in my tomorrow.

Cover this room with Thy Precious Blood. Send Thy holy angels, Michael, Gabriel, and Raphael, to guard the four corners of this room. Blessed St. Dymphna, patroness of those with troubled minds, intercede for my calm and restore my equilibrium.

Father, into Thy hands I commend my body, my thoughts, and my sleep. Grant me serene, deep, restorative rest. In Jesus' Holy Name. Amen.`
  },

  // =========================================================================
  // CONTINENT 3: FINANCIAL CATASTROPHE, DEBT & LEGAL TRIALS
  // =========================================================================
  {
    title: "Catholic Prayer in Severe Financial Distress, Eviction & Crushing Debt",
    slug: "prayer-severe-financial-distress-debt-eviction",
    category: "work",
    category_label: "Financial & Work Prayers",
    tags: ["occasion:financial-crisis", "debt", "eviction", "st-joseph", "providence", "unemployment"],
    content: `> 📜 **Scriptural Anchor**: *"Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?"* — Matthew 6:26
> 🕯️ **Instructions**: Light a candle before an image of St. Joseph the Worker or the Sacred Heart. Place your unpaid bills, notices, or budget ledger respectfully before the Lord.

Lord God of Heaven and Earth, Thou art Jehovah Jireh, the Lord Who Provides. I come to Thee humbled and burdened by crushing financial pressure, unpaid debts, and the terrifying prospect of losing my housing and livelihood.

Thou knowest every bill that has arrived, every deadline approaching, and the acute shame and helplessness that grips my chest. Deliver me, O Lord, from despair and panic. Remind me that my dignity as Thy beloved child is not determined by a bank balance, a credit rating, or the temporary lack of earthly coin.

St. Joseph, guardian of the Redeemer, who didst experience the bitter rejection of Bethlehem when there was no room at the inn, and the desperate flight into Egypt with no shelter: intercede for my family today. Pray to Jesus that honest employment, honorable income, emergency provision, and understanding creditors may be provided.

Give me wisdom to manage what little I possess with prudence and integrity. Open doors of unexpected assistance that no human hand can shut. Break the spirit of financial ruin and grant us our daily bread, that we may pay our honest debts, live in humble peace, and give glory to Thy Holy Name. Amen.`
  },
  {
    title: "Prayer on the Day of a Court Verdict, Lawsuit, or Legal Deposition",
    slug: "prayer-day-of-court-verdict-lawsuit-trial",
    category: "guidance",
    category_label: "Legal & Justice Prayers",
    tags: ["occasion:court", "lawsuit", "verdict", "justice", "truth", "trial", "judge"],
    content: `> 📜 **Scriptural Anchor**: *"The Lord loves righteousness and justice; the earth is full of his unfailing love."* — Psalm 33:5
> 🕯️ **Instructions**: Recite before entering the courthouse or logging into a legal deposition. Make the Sign of the Cross and ask the Holy Spirit to guard your lips.

Righteous Judge of the living and the dead, before whose throne all hidden motives and secret truths are unveiled: I place this legal proceeding and trial into Thy sovereign jurisdiction today.

Thou knowest the facts of this case; Thou knowest my heart and all the circumstances that have brought me before earthly magistrates. I pray that the spirit of truth, equity, and righteousness may prevail in the courtroom today.

Grant divine wisdom to my attorney, that they may present the truth with clarity, composure, and effectiveness. Soften the heart of the judge, the magistrates, and the jurors, delivering them from prejudice, deceit, and partiality. Protect me from false witnesses, malicious accusations, and unfair judgments.

Grant me supernatural composure under examination. Guard my tongue that I may speak with honesty, clarity, and dignity, without anger or confusion. If I have erred, grant me true humility and restitution; if I am falsely accused, be Thou my Shield and vindicator.

Above all earthly courts, I place my cause into Thy divine court of grace. Let Thy holy will be done, and let peace reign in my spirit throughout this day. Through Jesus Christ, the Advocate and High Priest. Amen.`
  },
  {
    title: "Deliverance Prayer for Freedom from Secret Addictions (Substances, Gambling, Lust)",
    slug: "deliverance-prayer-secret-addictions-substances-lust",
    category: "spiritual-warfare",
    category_label: "Deliverance & Freedom",
    tags: ["occasion:addiction", "deliverance", "freedom", "alcoholism", "pornography", "gambling", "clean-heart"],
    content: `> 📜 **Scriptural Anchor**: *"So if the Son sets you free, you will be free indeed."* — John 8:36
> 🕯️ **Instructions**: Kneel before a crucifix. Take holy water and cross yourself on the forehead. Pray this in times of severe temptation, or daily during addiction recovery (12-step programs).

Lord Jesus Christ, by the power of Thy Most Precious Blood poured out on Calvary, I come before Thee acknowledging my total helplessness against the chains of this addiction *(name the specific struggle: alcohol, drugs, pornography, gambling, food)*.

I confess that I have tried to break these chains in my own strength, only to fall back into regret, secrecy, and self-hatred. But what is impossible for man is possible with God. I renounce the lies of the enemy that tell me I can never change, that I am worthless, and that my sin defines who I am.

In the Holy Name of Jesus, I break every demonic attachment, every generational cycle, and every compulsive trigger associated with this habit. I rebuke the spirit of lust, intoxication, numbness, and escapism. Wash my mind, my senses, and my imagination in the ocean of Thy Divine Mercy.

Grant me the courage to walk in the light: to seek accountability, to attend fellowship, to confess my sins honestly, and to flee occasions of temptation. Fill the empty chambers of my soul with the fire of the Holy Spirit, that I may find in Thee the comfort, joy, and peace that no worldly poison can provide.

St. Maximilian Kolbe, patron of those trapped in addiction, and St. Augustine, who overcame the passions of the flesh: pray for my total liberation today. Amen.`
  },

  // =========================================================================
  // CONTINENT 4: LIFE MILESTONES, CHILDBIRTH & FAMILY OCCASIONS
  // =========================================================================
  {
    title: "Catholic Prayer for Couples Longing for a Child (Overcoming Infertility)",
    slug: "prayer-couples-longing-for-child-infertility",
    category: "family",
    category_label: "Family & Milestone Prayers",
    tags: ["occasion:infertility", "conception", "baby", "marriage", "st-gerard", "st-anne", "hope"],
    content: `> 📜 **Scriptural Anchor**: *"He gives the childless woman a family, making her a happy mother in her home. Praise the Lord!"* — Psalm 113:9
> 🕯️ **Instructions**: Husband and wife should hold hands together before an image of the Holy Family or St. Gerard Majella, lighting a candle and reciting this prayer in shared faith.

Heavenly Father, Creator of all life, who didst hear the weeping of Hannah, the longing of Sarah, and the steadfast prayers of Saints Joachim and Anne: look with tender mercy upon our marriage today.

Lord, Thou hast united us in the Holy Sacrament of Matrimony, and into our hearts Thou hast planted a deep and holy desire to participate in Thy creation by bringing forth new life into this world. Thou seest our tears, the quiet grief of each passing month, the medical appointments, and the ache of an empty nursery.

Heal any physical impediments, imbalances, or conditions in our bodies that hinder conception. Guide the physicians caring for us with moral and effective wisdom. Guard our marriage against resentment, blame, or exhaustion; let this trial draw our hearts closer to one another and closer to the Cross.

St. Gerard Majella, wonder-working patron of mothers and expectant families, take our petition directly to the throne of Jesus. If it be Thy holy will, grant us the joy of conceiving, carrying, and welcoming a healthy child whom we promise to consecrate to Thy service.

Yet not our will, but Thine be done. We surrender our timing to Thy perfect providence. Sacred Heart of Jesus, we trust in Thee! Amen.`
  },
  {
    title: "Prayer on the Day of Childbirth and Safe Labor & Delivery",
    slug: "prayer-day-of-childbirth-safe-labor-delivery",
    category: "children",
    category_label: "Family & Milestone Prayers",
    tags: ["occasion:childbirth", "labor", "delivery", "safe-birth", "hospital", "newborn", "st-gerard"],
    content: `> 📜 **Scriptural Anchor**: *"When a woman is giving birth, she has sorrow because her hour has come, but when she has delivered the baby, she no longer remembers the anguish, for joy that a human being has been born into the world."* — John 16:21
> 🕯️ **Instructions**: Recited by the mother, father, or family members in the delivery suite when contractions intensify or before entering the labor room.

Lord Jesus Christ, Son of the Living God, born of the Virgin Mary in the humble cave of Bethlehem: accompany us into this holy and decisive hour of childbirth.

We pray for this mother in her labor. Grant her bodily stamina, rhythmic breathing, emotional courage, and supernatural peace. As contractions surge, remind her that each wave brings her closer to looking into the face of her precious baby. Grant her relief from excessive distress, and preserve her strength throughout the delivery.

We place the unborn child into Thy loving hands. Guide the baby into a safe and natural position for birth. Protect the child from umbilical complications, distress, oxygen deprivation, and all birth trauma. 

Bless the obstetrician, midwives, delivery nurses, and pediatricians. Guide their hands and monitoring equipment with skill and prompt discernment. May this delivery be smooth, safe, and triumphant.

Blessed Virgin Mary, who didst hold the newborn Infant Jesus to thy breast, surround this delivery room with holy peace. St. Gerard Majella and St. Margaret of Antioch, patrons of childbirth, pray for us. Father, let our first sound be the cry of new life, and our response be tears of thanksgiving. Amen.`
  },
  {
    title: "Prayer of Deep Consolation After a Miscarriage or Loss of a Baby",
    slug: "prayer-consolation-miscarriage-loss-of-baby",
    category: "eternal",
    category_label: "Family & Milestone Prayers",
    tags: ["occasion:miscarriage", "loss-of-baby", "grief", "mourning", "consolation", "angels", "healing"],
    content: `> 📜 **Scriptural Anchor**: *"Before I formed you in the womb I knew you, before you were born I set you apart."* — Jeremiah 1:5
> 🕯️ **Instructions**: Light a white candle in a quiet space. Place a small flower, ultrasound image, or keepsake before the crucifix. Pray this in private or together as grieving parents.

O God of love and author of all life, our hearts are shattered by the sudden loss of our precious baby, whom we carried with such immense love and expectation. The nursery is silent, our arms are empty, and tears flow from the deepest depths of our souls.

Lord, although our child never drew an earthly breath outside the womb, we know that their soul was known and loved by Thee from all eternity. We entrust our sweet baby into the eternal embrace of Thy infinite mercy. We believe that they rest now in the light of Thy heavenly kingdom, shielded forever from pain, sickness, sorrow, and sin.

Comfort our broken hearts as only the Holy Spirit can. Comfort this mother whose body grieves the life it nurtured; comfort this father who mourns his child in silent agony. Guard us against self-blame, bitterness, or despair.

Holy Mother Mary, Our Lady of Sorrows, who didst cradle Thy crucified Son in thine arms at the foot of Calvary, wrap our departed little one in thy maternal mantle. Teach us to trust that love is stronger than death, and grant that one day, when our earthly pilgrimage is finished, we may embrace our beloved child forever in the glory of Heaven. Amen.`
  },
  {
    title: "Birthday Prayer of Blessing and Protection for a Son or Daughter",
    slug: "birthday-prayer-blessing-son-daughter",
    category: "children",
    category_label: "Family & Milestone Prayers",
    tags: ["occasion:birthday", "son", "daughter", "blessing", "protection", "future", "family"],
    content: `> 📜 **Scriptural Anchor**: *"The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace."* — Numbers 6:24-26
> 🕯️ **Instructions**: Parents should place a hand gently upon the child's head or shoulder, making the Sign of the Cross upon their forehead with holy water or oil.

Heavenly Father, with overflowing gratitude we bring our beloved child before Thee on this anniversary of their birth. We thank Thee for the moment they entered this world, for their laughter, their unique talents, their growth, and the joy they bring into our home.

Lord, as they mark another year of life, we pray Thy richest blessings upon their body, mind, and spirit. Protect them from the snares of this world, from toxic influences, from physical danger, and from spiritual complacency. Enkindle in their heart a burning love for Jesus Christ and a passion for truth, righteousness, and service to others.

Guide their footsteps as they navigate friendships, education, career, and vocation. Grant them wisdom to discern right from wrong and courage to stand firm in their faith when trials arise. Let Thy Holy Guardian Angel walk beside them every day of their earthly journey.

Bless their future with health, happiness, fruitful work, and holy friendships. May they always know how deeply they are loved by us and, above all, by their Heavenly Father. In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.`
  },
  {
    title: "Birthday Prayer of Thanksgiving, Honor and Health for a Mother or Father",
    slug: "birthday-prayer-mother-father-honor-health",
    category: "family",
    category_label: "Family & Milestone Prayers",
    tags: ["occasion:birthday", "mother", "father", "parents", "honor", "health", "thanksgiving"],
    content: `> 📜 **Scriptural Anchor**: *"Honor your father and your mother, so that you may live long in the land the Lord your God is giving you."* — Exodus 20:12
> 🕯️ **Instructions**: Recited as a family gathering around the birthday table before the sharing of the birthday meal.

Almighty and everlasting God, we raise our voices in joyful thanksgiving today to honor our precious *(Mother / Father)* on their birthday.

We thank Thee for their lifetime of sacrifices, for the unconditional love they poured into our lives, for their sleepless nights of care, and for the wisdom and faith they modeled for us. Through their hands, we first learned the meaning of Thy divine tenderness and fatherly strength.

We ask Thee to pour out abundant blessings upon them today. Grant them robust health of body, clarity of mind, and serene joy in their soul. Comfort any chronic aches, remove all burdens and anxieties from their shoulders, and crown their senior years with honor, dignity, and peace.

May they see the fruits of their labors blossom in their children and grandchildren. Surround them with the love and reverence they so richly deserve. Keep them safe under the shadow of Thy wings for many fruitful years to come, until that day when we are all gathered in Thy eternal home. Amen.`
  },
  {
    title: "Prayer Before Difficult Examinations & Student Anxiety (St. Joseph of Cupertino)",
    slug: "prayer-before-exams-student-anxiety-st-joseph-cupertino",
    category: "guidance",
    category_label: "Academic & Student Prayers",
    tags: ["occasion:exams", "student", "school", "university", "st-joseph-cupertino", "memory", "clarity"],
    content: `> 📜 **Scriptural Anchor**: *"If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."* — James 1:5
> 🕯️ **Instructions**: Pray on the morning of the exam or while seated at your desk waiting for the examination papers or digital test to begin. Take a deep breath and offer your studies to God.

O Great St. Joseph of Cupertino, who while on earth didst obtain from God the grace of being asked at examinations only the questions which thou didst know: obtain for me today similar favor in the examination for which I am preparing.

Lord Jesus, I have studied and worked to the best of my ability; now I surrender my nervous anxiety into Thy hands. Clear my mind of panic, brain fog, and self-doubt. Grant me sharp recall of the material I have reviewed, clarity to understand each question, and precision in writing my answers.

Holy Spirit, Divine Counselor, awaken my intellect and memory. Let not the pressure of the clock disturb my inner peace. Help me to manage my time wisely, to check my work carefully, and to reflect the talents Thou hast bestowed upon me.

May this examination serve to open the doors of my education and career according to Thy holy will, that through my future work I may serve my neighbors and glorify Thy kingdom. St. Joseph of Cupertino, patron of students and examinees, pray for me! St. Thomas Aquinas, patron of schools, pray for me! Amen.`
  },
  {
    title: "Epiphany & Annual Catholic Blessing of the Home (Chalking the Door)",
    slug: "epiphany-annual-catholic-house-blessing",
    category: "protection",
    category_label: "Home & Property Blessings",
    tags: ["occasion:house-blessing", "epiphany", "home", "protection", "family", "peace", "hospitality"],
    content: `> 📜 **Liturgical Tradition**: Traditionally celebrated on the Feast of the Epiphany (January 6th) or whenever moving into a new residence. Using blessed chalk, the head of the home writes above the main entrance: **20 + C + M + B + 26** *(Caspar, Melchior, Balthasar / Christus Mansionem Benedicat: "May Christ Bless this House")*.
> 🕯️ **Instructions**: Walk through the rooms of the home with holy water, sprinkling each doorway while reciting these prayers.

**Leader:** Peace be to this house.  
**All:** And to all who dwell herein.

**Leader:** From the East came the Magi to Bethlehem to adore the Lord; and opening their treasures they offered costly gifts: gold to the great King, incense to the true God, and myrrh in symbol of His burial. Alleluia.

**The Inscription Prayer (Write on the lintel: 20 + C + M + B + 26):**

Bless, O Lord God Almighty, this home, that in it there may be health, purity, the strength of victory, humility, goodness and mercy, the fulfillment of Thy law, and thanksgiving to God the Father and to the Son and to the Holy Spirit. 

May Thy holy angels dwell within these walls to guard, cherish, protect, visit, and defend all who inhabit this sanctuary. May all who enter here find peace, warmth, and Christian hospitality. Drive far from this threshold all darkness, discord, bitterness, and demonic oppression.

And may this blessing remain upon this house and upon all who reside here, through Christ our Lord. Amen.`
  },
  {
    title: "Catholic Prayer for Family Reconciliation & Healing Estranged Relationships",
    slug: "prayer-family-reconciliation-estranged-relationships",
    category: "family",
    category_label: "Family & Reconciliation Prayers",
    tags: ["occasion:reconciliation", "family-discord", "estrangement", "forgiveness", "healing-hearts", "peace"],
    content: `> 📜 **Scriptural Anchor**: *"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you."* — Ephesians 4:32
> 🕯️ **Instructions**: Kneel before the crucifix. Mention the names of the family members, siblings, parents, or in-laws from whom you are estranged.

Lord Jesus Christ, Prince of Peace and Reconciler of the nations: look with pity upon the divisions, woundedness, and estrangement that plague our family.

Thou knowest the harsh words spoken, the misunderstandings left unresolved, the pride that keeps us silent, and the accumulated bitterness that has built walls between us. Lord, where human hearts have hardened like stone, send the softening rain of Thy Holy Spirit.

I choose this day to release the desire for vengeance, retaliation, and being right. I forgive *(mention names)* for every wound, slight, and offense, whether intended or accidental. Where I have caused grief, insensitivity, or pride, grant me the humility to acknowledge my faults and seek forgiveness without defense.

Break down the generational curses of anger, silent treatments, and cold division in our bloodline. Touch the heart of my estranged family members even now as I pray. Give us the opportunity, the courage, and the gentle words needed to begin reconciliation.

Holy Family of Jesus, Mary, and Joseph, restore love, mutual respect, and unity to our home. Sacred Heart of Jesus, fountain of mercy, unite our hearts in Thee. Amen.`
  },
  {
    title: "Commendation of a Dying Soul (Deathbed Prayer at the Final Breath)",
    slug: "commendation-of-dying-soul-deathbed-prayer",
    category: "eternal",
    category_label: "End of Life & Funeral Prayers",
    tags: ["occasion:deathbed", "dying", "commendation-of-soul", "eternal-rest", "mercy", "angels"],
    content: `> 📜 **Liturgical Tradition**: Taken from the ancient Catholic *Ordo Commendationis Animae* (Commendation of the Dying). Recited by family, friends, or the priest at the bedside when death is imminent.
> 🕯️ **Instructions**: Place a crucifix in the dying person's hands or before their eyes. Light a blessed candle and sprinkle holy water gently over them, whispering these words into their ear.

Go forth, Christian soul, from this world:  
In the name of God the Father Almighty, who created thee;  
In the name of Jesus Christ, the Son of the Living God, who suffered for thee;  
In the name of the Holy Spirit, who was poured out upon thee;  
In the communion of the holy Angels and Archangels;  
In the assembly of Patriarchs, Prophets, Apostles, Martyrs, Confessors, and all the Saints of God.

May thy rest be this day in peace, and thy dwelling place in the Heavenly Jerusalem.

May Christ, who was crucified for thee, deliver thee from eternal torment. May Christ, who died for thee, receive thee into His garden of paradise. May Christ, the true Shepherd, acknowledge thee among His sheep. May He absolve thee from all thy sins, and set thee among His elect.

Mayest thou see thy Redeemer face to face, and standing always in His presence, behold with joyful eyes the unveiled Truth for ever and ever.

Into Thy hands, Lord, we commend the spirit of Thy servant *(mention name)*. Receive them, O Lord, into Thy holy peace. Amen.`
  },

  // =========================================================================
  // CONTINENT 5: PROFESSIONS, WORKERS & VOCATIONS
  // =========================================================================
  {
    title: "The Physician, Surgeon & Nurse's Daily Prayer Before Patient Care",
    slug: "physician-surgeon-nurse-prayer-before-patient-care",
    category: "work",
    category_label: "Professions & Vocations",
    tags: ["profession:medical", "physician", "nurse", "surgeon", "hospital", "st-luke", "compassion"],
    content: `> 📜 **Scriptural Anchor**: *"Honor the physician with the honor due him, for the uses which ye may have of him: for the Lord hath created him."* — Sirach 38:1
> 🕯️ **Instructions**: Recite at the start of your medical shift, before morning hospital rounds, or while scrubbing hands before surgery.

Divine Physician of Souls and Bodies, who didst heal the sick, open the eyes of the blind, and touch the untouchable leper: I consecrate my medical profession and all my patients into Thy hands today.

As I step onto the hospital floor and enter the rooms of the suffering, grant me Thy eyes to see each patient not merely as a clinical case, a room number, or a disease, but as a sacred person created in Thine image and likeness.

Bless my mind with diagnostic acuity and scientific competence. Guard my hands with precision, steadiness, and gentle care. When fatigue threatens to numb my empathy, renew within me the flame of compassionate service that first called me to this vocation.

Give me the right words of comfort for anxious families and the wisdom to know when to speak and when to remain silently present. Protect me from professional cynicism, diagnostic arrogance, and fatal errors.

St. Luke the Beloved Physician and St. Camillus de Lellis, patron of hospitals and caregivers, intercede for me and all healthcare workers today. In Jesus' Holy Name. Amen.`
  },
  {
    title: "The Police Officer & First Responder's Prayer for Protection & Justice",
    slug: "police-officer-first-responder-prayer-protection-justice",
    category: "protection",
    category_label: "Professions & Vocations",
    tags: ["profession:police", "first-responder", "law-enforcement", "st-michael", "courage", "justice"],
    content: `> 📜 **Scriptural Anchor**: *"Blessed are the peacemakers, for they shall be called the children of God."* — Matthew 5:9
> 🕯️ **Instructions**: Recited before putting on the uniform, badge, or duty belt at the start of each patrol shift.

Lord God of hosts, Watchman of the city and Protector of the innocent: I ask Thy divine shield upon me as I put on this uniform and badge today.

Grant me courage in the face of danger, firmness in upholding the law, and compassion for the vulnerable and victims of crime. Give me split-second discernment in moments of chaos, clarity of judgment in crisis, and physical speed and protection when confronting violent threats.

Deliver me from corruption, brutality, cynicism, and hardening of heart. Help me to treat every citizen with fairness, dignity, and calm authority, regardless of their background or hostility.

St. Michael the Archangel, patron of law enforcement, stand at my side as heavenly backup on every call, traffic stop, and alleyway. Protect my partners and watch over my home and family while I am on duty, that I may return home safely at the end of this watch.

Blessed are the peacemakers, for they shall be called children of God. Lord, keep my shield untarnished and my soul pure. Through Christ our Lord. Amen.`
  },
  {
    title: "The Software Engineer, Coder & Digital Creator's Prayer (St. Isidore)",
    slug: "software-engineer-coder-creator-prayer-st-isidore",
    category: "work",
    category_label: "Professions & Vocations",
    tags: ["profession:tech", "coder", "software-engineer", "st-isidore", "technology", "wisdom", "focus"],
    content: `> 📜 **Historical Context**: St. Isidore of Seville (560–636 AD) created the first encyclopedia (*Etymologiae*) systematizing all known human knowledge, and was declared by the Holy See as the patron saint of the Internet, computer scientists, and programmers.
> 🕯️ **Instructions**: Recite at your workstation before opening your IDE, writing code, or deploying systems to production.

Almighty and eternal God, who hast created mankind in Thine own image and hast commanded us to subdue the earth and cultivate all that is good, true, and beautiful:

Look with favor upon my work in technology and computer science today. Thou who art the Supreme Architect and Author of the universe, who didst structure creation with mathematical elegance and harmony: grant me clarity of mind as I design systems, write code, debug errors, and build digital tools.

Protect my mind from mental fatigue, eye strain, and the pride of cleverness. Help me to write clean, ethical, secure, and accessible systems that uplift humanity and respect human dignity rather than ensnaring souls in distraction, vice, or manipulation.

Give me patience when troubleshooting elusive bugs, and humility to collaborate generously with fellow engineers and creators. May the tools I build today serve the truth, foster genuine communion, and reflect Thy divine light in this digital age.

St. Isidore of Seville, patron of computer scientists and the Internet, pray for our code and our souls. Amen.`
  },
  {
    title: "The Firefighter's Prayer for Courage & Safety in the Flames (St. Florian)",
    slug: "firefighter-prayer-courage-safety-flames-st-florian",
    category: "protection",
    category_label: "Professions & Vocations",
    tags: ["profession:firefighter", "first-responder", "courage", "st-florian", "rescue", "safety"],
    content: `> 📜 **Scriptural Anchor**: *"When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you. When you walk through the fire, you will not be burned; the flames will not set you ablaze."* — Isaiah 43:2
> 🕯️ **Instructions**: Recite at the firehouse during roll call or before donning turnout gear at the alarm bell.

When duty calls me, O Lord, to battle the raging flames, give me the strength to save a life, whatever be its name.

Help me embrace a frightened child before it is too late, or save an older person from the horror of that fate. Enable me to be alert, and hear the weakest shout, and quickly and efficiently to put the fire out.

I want to fill my calling, and to give the best in me, to guard my friend and neighbor, and protect their property. And if according to Thy will, I must forfeit my life, bless with Thy protecting hand my children and my wife.

St. Florian, patron of firefighters, protect our crew from collapsing roofs, sudden flashovers, toxic smoke, and unseen hazards. Bring us all back safely to the firehouse at the end of the shift. In Jesus' Name. Amen.`
  }
];

async function main() {
  console.log(`Starting to seed ${ENCYCLOPEDIC_PRAYERS.length} Master Encyclopedic Prayers...`);

  let added = 0;
  let updated = 0;

  for (const item of ENCYCLOPEDIC_PRAYERS) {
    const existing = await prisma.prayer.findFirst({
      where: {
        OR: [
          { slug: item.slug },
          { title: item.title }
        ]
      }
    });

    if (existing) {
      await prisma.prayer.update({
        where: { id: existing.id },
        data: {
          slug: item.slug,
          category: item.category,
          category_label: item.category_label,
          tags: item.tags,
          content: item.content,
          is_active: true,
        }
      });
      console.log(`✓ Updated: "${item.title}" (ID: ${existing.id})`);
      updated++;
    } else {
      const created = await prisma.prayer.create({
        data: {
          title: item.title,
          slug: item.slug,
          category: item.category,
          category_label: item.category_label,
          tags: item.tags,
          content: item.content,
          is_active: true,
        }
      });
      console.log(`+ Created: "${item.title}" (ID: ${created.id})`);
      added++;
    }
  }

  console.log(`\nCompleted! Added: ${added}, Updated: ${updated}`);
}

main()
  .catch(e => {
    console.error("Error seeding prayers:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
