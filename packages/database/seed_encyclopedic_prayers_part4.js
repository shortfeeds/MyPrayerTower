const path = require('path');
const { PrismaClient } = require(path.resolve(__dirname, '../../node_modules/@prisma/client'));
const prisma = new PrismaClient();

const ENCYCLOPEDIC_PRAYERS_PART4 = [
  // =========================================================================
  // CONCEPTION, MATERNITY & EARLY INFANCY
  // =========================================================================
  {
    title: "Prayer for Couples Actively Trying to Conceive (Nuptial Blessing of Fertility)",
    slug: "couples-trying-to-conceive-fertility-blessing",
    category: "children",
    category_label: "Conception & Fertility",
    tags: ["occasion:conception", "fertility", "marriage", "children", "st-joachim-anne", "hope", "pregnancy"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Hannah's prayer at Shiloh (1 Samuel 1:27: "For this child I prayed, and the Lord hath given me my petition") and Saints Joachim and Anne, who endured decades of childlessness before conceiving Mary, the Mother of God.
> 🕯️ **Liturgical Setting & Posture**: Husband and wife kneel together, holding hands before a domestic crucifix or image of the Holy Family, uniting their physical and spiritual longing for parenthood.

Heavenly Father, Author and Sustainer of all life,
Who in the beginning didst bless marriage and commanded husband and wife: "Be fruitful and multiply."

Look with tender mercy upon the deep desire of our hearts.
Thou hast united us in the holy Sacrament of Matrimony,
and we desire with all our souls to welcome a child into our home,
to nurture, protect, and raise them to love and serve Thee in this world.

Lord, remove every biological impediment, hormonal imbalance, and physical obstacle that hinders conception.
Grant wisdom and skill to the physicians and specialists assisting us.
Preserve our marriage from the strain of disappointment, the silent grief of each passing month,
and the temptation to envy other families.

Like Abraham and Sarah, like Elkanah and Hannah, like Joachim and Anne:
we place our longing into Thy sovereign hands.
If it be Thy holy will, open the womb of my wife; bless the seed of my husband;
and grant that our home may soon echo with the joyful laughter of a newborn.

Above all, let Thy divine will be done in our lives.
Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Bedrest and High-Risk Pregnancy Vigil: Holding Mother and Unborn Child in Grace",
    slug: "high-risk-pregnancy-bedrest-vigil-mother-unborn-child",
    category: "healing",
    category_label: "Pregnancy & Maternity",
    tags: ["occasion:pregnancy", "high-risk", "bedrest", "mother", "unborn-child", "protection", "healing"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in Psalm 139:13-14 ("Thou didst knit me together in my mother's womb") and invoking Saint Gerard Majella, patron saint of expectant mothers, during medical complications, premature dilation, or placental danger.
> 🕯️ **Instructions & Posture**: Rest quietly in bed with one hand placed gently upon the abdomen. Breathe slowly, surrendering all medical fear to the Divine Physician.

O Most Sweet Jesus, Divine Healer and Protector of the helpless:

I lie here in the forced stillness of bedrest, counting the hours, days, and weeks.
Thou knowest the fears that grip my heart: the fear of premature delivery,
the frightening monitors and ultrasound measurements, and the physical aches of confinement.

Lord Jesus, reach Thy hand into my womb.
Strengthen the placenta, steady the cervix, regulate the fluid, and sustain the heartbeat of this precious unborn baby.
Guard every delicate organ, tiny bone, and fragile vessel currently taking shape beneath my heart.

Give me the patience to endure these long days without complaint.
Transform this bed of medical restriction into an altar of prayer and maternal love.
Give wisdom to my obstetricians, maternal-fetal medicine specialists, and nurses.

Keep this baby safe within the shelter of my body until the full appointed term of forty weeks,
that we may bring forth a healthy, thriving child to receive the waters of Holy Baptism.

Our Lady of La Leche, nurse of the infant Jesus, wrap us in your protective mantle. Amen.`
  },
  {
    title: "The Morning of a Prenatal Ultrasound & Waiting for Screening Results",
    slug: "prenatal-ultrasound-waiting-for-screening-results",
    category: "guidance",
    category_label: "Pregnancy & Screening",
    tags: ["occasion:ultrasound", "screening", "anxiety", "unborn-child", "parents", "peace", "hospital"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking the words of the angel Gabriel to Mary (Luke 1:30: "Fear not, Mary, for thou hast found favor with God"), offering peace to parents seated in waiting rooms before medical screens and genetic diagnoses.
> 🕯️ **Liturgical Setting & Posture**: Prayed while seated in the clinic waiting room or in the car before entering the medical center. Spouses hold hands.

Lord God Almighty, Maker of heaven and earth,
Who seest into the secret places and before whose eyes nothing in creation is hidden:

As we sit this morning awaiting this ultrasound examination and medical test results,
our hearts are fluttering with a mixture of awe, anticipation, and anxious fear.
We tremble at what the monitors might reveal, and we ask for Thy calming Holy Spirit to steady our breathing.

We surrender this tiny unborn life entirely into Thy hands.
We pray that the technician's probe may reveal a strong, steady heartbeat,
properly developing organs, healthy limbs, and peace in the womb.

Lord, whatever news the physicians bring us today,
remind us that this child is made in Thine own divine image and likeness,
infinitely loved by Thee before the foundation of the world.
Cast out all spirit of panic and despair.
Give our doctors discerning eyes and gentle, truthful tongues.

Cover our baby with the wings of holy angels, and grant us the peace that surpasses all human understanding.
Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Father's Prayer for his Wife During Active Labor and Childbirth Delivery",
    slug: "father-prayer-wife-labor-childbirth-delivery",
    category: "family",
    category_label: "Childbirth & Fatherhood",
    tags: ["occasion:labor", "childbirth", "father", "husband", "wife", "delivery", "strength"],
    content: `> 📜 **Historical & Biblical Origin**: Grounded in Saint Joseph's loving, protective vigil beside the Blessed Virgin Mary in the quiet cave of Bethlehem during the holy birth of our Savior (Luke 2:6-7).
> 🕯️ **Instructions & Posture**: Prayed silently or whispered by the father while holding his wife's hand at the bedside in the labor and delivery room during contractions.

Lord Jesus Christ, Son of the Living God,
Who didst enter our human world through the pains of childbirth,
nursed at the breast of the Virgin Mary under the watchful protection of Saint Joseph:

Stand beside my wife, [Wife's Name], in this delivery room.
Thou knowest her exhaustion, the intensity of each contraction, and the strain upon her body and spirit.
Give her supernatural strength, steady breathing, endurance, and courage as she brings forth our child.

Preserve her from hemorrhage, sudden complications, panic, and unnecessary medical trauma.
Guide the hands, minds, and split-second decisions of the doctors, midwives, and labor nurses attending her.

Guide our baby safely through the birth canal into the light of this world.
Let the child take their first breath with vigor and cry aloud with healthy lungs.

Help me, Lord, to be a pillar of calm reassurance, gentle prayer, and steady support for my wife.
May our child be safely delivered into our awaiting arms to give Thee praise.
In the Holy Name of Jesus. Amen.`
  },
  {
    title: "Vigil Beside a Premature Infant in Neonatal Intensive Care (NICU)",
    slug: "nicu-premature-baby-hospital-vigil-prayer",
    category: "healing",
    category_label: "NICU & Premature Infants",
    tags: ["occasion:nicu", "premature-baby", "infant", "healing", "st-philomena", "parents", "hospital"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Christ's tender declaration (Matthew 18:10: "In heaven their angels do always behold the face of my Father which is in heaven") and Saint Philomena, patroness of infants and the despairing.
> 🕯️ **Liturgical Setting & Posture**: Stand or sit beside the incubator. Place clean fingers gently through the portholes against the infant's tiny hand or foot.

O Divine Infant Jesus, Who didst rest frail and small in the manger of Bethlehem:

Look down with infinite tenderness upon our tiny baby, [Baby's Name],
lying here inside this incubator, surrounded by wires, monitors, and breathing tubes.
The child is so small, so fragile, yet so precious in Thy sight.

Lord Jesus, Breath of Life, breathe vigor into these underdeveloped lungs.
Close the tiny heart ducts that need to close; preserve the brain from bleed or injury;
give strength to the fragile digestive system; and shield this incubator against infection and sepsis.

Give wisdom, delicate skill, and vigilance to every neonatologist, respiratory therapist, and NICU nurse on duty.
Comfort our hearts as parents: when the alarms sound and our tears flow,
remind us that Thine own pierced hands are cradling this infant every second of this night.

Bring our baby safely through each day, each milestone, each ounce gained,
until the day we carry our healthy child home in triumph.
Through Christ our Lord. Amen.`
  },
  {
    title: "Postpartum Depression, Melancholy and Maternal Exhaustion",
    slug: "postpartum-depression-melancholy-maternal-exhaustion",
    category: "peace",
    category_label: "Maternal Mental Health",
    tags: ["postpartum", "depression", "motherhood", "mental-health", "exhaustion", "peace", "st-dymphna"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Saint Dymphna, Patron Saint of nervous afflictions, mental anguish, and emotional distress, alongside Our Lady of Sorrows who understands every maternal tear.
> 🕯️ **Instructions & Posture**: Recite when sitting with a nursing baby or in a dark nursery when waves of sadness, numbness, guilt, or inadequacy strike without warning.

O Lord God of tenderness and mercy,
Thou seest the secret tears I cry in the darkness of this nursery.
Everyone tells me I should be overflowing with joy,
yet a heavy fog of exhaustion, sadness, anxiety, and numbness weighs upon my soul.

Lord, Thou knowest the depletion of my body, the sleepless nights,
and the chemical storms raging through my mind.
Deliver me from the crushing guilt that whispers I am a bad mother,
or that I do not love my child enough.

Jesus, gentle Shepherd, pick me up as a bruised reed.
Restore balance to my hormones, my brain, and my nervous system.
Give me the humility to ask for help, to accept rest, and to seek proper medical care without shame.

Send Thy holy angels to watch over my baby when my arms are weak.
Re-ignite within my heart the joyful spark of maternal love,
and let me know that this heavy valley is temporary, and Thy grace will carry us through.
Through Christ our Lord. Amen.`
  },

  // =========================================================================
  // CHILDHOOD, SCHOOL & COMING OF AGE
  // =========================================================================
  {
    title: "First Day of Kindergarten & Overcoming Separation Anxiety",
    slug: "first-day-kindergarten-school-separation-anxiety",
    category: "children",
    category_label: "Early Childhood & School",
    tags: ["occasion:first-day-school", "kindergarten", "children", "parents", "guardian-angel", "anxiety"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Psalm 91:11 ("For He will command His angels concerning you to guard you in all your ways") and the Catholic tradition of consecrating little children to their Guardian Angel on their first day leaving the home.
> 🕯️ **Liturgical Setting & Posture**: Parents kneel down to eye level with their child before walking through the school entrance or getting on the school bus, making the Sign of the Cross with their thumb on the child's forehead.

Angel of God, my child's guardian dear,
To whom God's love commits [Child's Name] here:
Ever this day be at their side,
To light and guard, to rule and guide.

Heavenly Father, as I let go of my child's hand at this classroom door,
my eyes are filled with tears and my heart feels the ache of separation.
My baby is growing up and stepping into the wide world.

Lord, take [Child's Name] by the hand.
Calm all tears, fright, and separation anxiety in their little chest.
Provide kind and patient teachers who will encourage, teach, and protect them.
Give them friendly classmates and the gift of good friendships.

Keep them safe on the playground, in the hallways, and on the school bus.
Shield their youthful innocence from cruelty or fear.
And bring them back safely into my arms this afternoon,
with a joyful smile and a heart eager to tell of the day's wonders.
Through Jesus Christ our Lord. Amen.`
  },
  {
    title: "Prayer for a Child Who Is Bullied, Teased, or Ostracized at School",
    slug: "child-bullied-teased-school-protection-healing",
    category: "children",
    category_label: "School & Youth Protection",
    tags: ["bullying", "children", "school", "dignity", "protection", "healing", "confidence"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in Christ's defense of the little ones (Matthew 18:6) and His own endurance of cruel mockery, jeering, and taunts on the road to Calvary (Isaiah 53:3: "He was despised and rejected of men").
> 🕯️ **Liturgical Setting & Posture**: Prayed with your arm around your child after a painful day at school, or privately by parents seeking divine intervention.

Lord Jesus Christ, Who didst endure the cruel taunts, spitting, and laughter of bullies without losing Thine infinite dignity:

Look upon my precious child, [Child's Name], whose tender heart has been bruised today by cruel words, exclusionary cliques, or physical intimidation at school.
Thou seest the silent tears cried in the school bathroom, the dread of the cafeteria, and the loneliness of the playground.

Lord, heal the sting of every harsh name and mockery spoken over my child.
Uproot any lie that tells them they are ugly, stupid, worthless, or unloved.
Etch deeply upon their spirit the truth: that they are wonderfully and fearfully made,
the apple of Thy divine eye, and redeemed by Thy Precious Blood.

Surround them with a hedge of holy warrior angels.
Give them courageous friends who will stand beside them against cruelty.
Grant school administrators, teachers, and counselors vigilance to see the bullying and the backbone to stop it.
And touch the hearts of those who torment them, converting their cruelty into repentance.

Restore my child's confidence, joy, and peace. Through Christ our Lord. Amen.`
  },

  // =========================================================================
  // LOVE, SINGLEHOOD, COURTSHIP & WEDDINGS
  // =========================================================================
  {
    title: "A Single Person Praying for Their Future Spouse (In Honor of St. Raphael)",
    slug: "single-person-prayer-future-spouse-st-raphael",
    category: "marriage",
    category_label: "Singlehood & Courtship",
    tags: ["singlehood", "future-spouse", "courtship", "dating", "st-raphael", "discernment", "purity", "marriage"],
    content: `> 📜 **Historical & Biblical Origin**: Inspired by the Archangel Saint Raphael (*God Heals*), who guided young Tobias safely on his long journey to find his holy and faithful wife Sarah (Book of Tobit 8).
> 🕯️ **Liturgical Setting & Posture**: Prayed in quiet reflection, during Eucharistic Adoration, or on a personal retreat, consecrating your single season to God.

Holy Archangel Raphael, patron of happy meetings and faithful marriages,
thou who didst guide Tobias to the companion appointed for him by God:

I place into thy heavenly custody the desires of my heart for holy marriage.
Wherever my future spouse may be this day—in my city or in distant lands—
I ask thee to watch over them with angelic care.

Preserve them in purity of body, mind, and spirit.
Protect them from the toxic deceptions of modern hookup culture, from heartbreak, and from moral compromise.
Help them to grow daily in wisdom, holiness, and the virtues necessary to be a faithful, sacrificial spouse.

And work within my own heart, Lord.
Deliver me from the panic of loneliness, from settling for unworthy relationships out of fear,
and from seeking in a human partner what only God can fulfill.
Make me into the person my future spouse deserves.

In God's perfect time and providence, arrange our meeting,
open our eyes to recognize one another, and lead us into a covenant that shall mirror the love of Christ and His Church. Amen.`
  },
  {
    title: "Healing After a Painful Breakup or Broken Engagement",
    slug: "healing-after-painful-breakup-broken-engagement",
    category: "peace",
    category_label: "Emotional Healing & Heartbreak",
    tags: ["heartbreak", "breakup", "broken-engagement", "healing", "forgiveness", "peace"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Psalm 34:18 ("The Lord is nigh unto them that are of a broken heart, and saveth such as be of a contrite spirit"), bringing emotional betrayal, abandonment, and broken dreams to the Cross.
> 🕯️ **Instructions & Posture**: Sit in silence, releasing photos, rings, or mementos before Christ. Speak the name of the former partner and consciously release all bitter resentment.

Lord Jesus Christ, Physician of wounded hearts,
Thou who didst know the agony of being forsaken by those who promised never to leave Thee:

I bring before Thee the shattered pieces of my heart.
The plans we made, the future we envisioned, and the promises spoken have come to an end.
My chest aches with grief, confusion, anger, and the pain of rejection.

Lord, heal this raw wound.
When memories flood my mind and loneliness threatens to overwhelm me, be my refuge.
Deliver me from re-reading old messages, from obsessing over what went wrong,
and from the bitter poison of wishing harm upon [Name].

By an act of my will, I choose today to forgive [Name].
I release them into Thy hands and sever every unholy soul tie.
Take away all feelings of worthlessness, humiliation, and the fear that I will forever be unloved.

Remind me that my true identity is rooted in being Thy beloved.
Rebuild my confidence, restore my peace, and prepare my heart for whatever future Thou hast in store.
In Jesus' Holy Name. Amen.`
  },
  {
    title: "Morning of the Wedding Day: Bride and Groom Private Offering",
    slug: "morning-of-wedding-day-bride-groom-prayer",
    category: "marriage",
    category_label: "Sacraments & Nuptials",
    tags: ["occasion:wedding-day", "marriage", "bride", "groom", "covenant", "holy-matrimony"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking the wedding at Cana in Galilee where Jesus worked His first public miracle, raising human marriage into a holy Sacrament of the New Covenant (John 2:1-11).
> 🕯️ **Liturgical Setting & Posture**: Prayed privately by the bride or groom on the morning of the wedding, before putting on wedding attire and traveling to the church.

Lord God of our fathers,
The day has finally arrived that my heart has awaited for so long.
In just a few hours, I will stand before Thy holy altar, surrounded by our families and friends,
to exchange the sacred vows of Holy Matrimony with [Name of Betrothed].

Calm all nervous flutterings in my chest.
Let not the details of dresses, flowers, photographers, and banquets distract my soul
from the awesome reality of the Sacrament I am about to receive.

As Christ loved the Church and gave Himself up for her,
so grant that I may love [Name] with a sacrificial, patient, and unswerving charity.
Give us the grace to be one flesh and one spirit:
in abundance and poverty, in sickness and health, in youth and old age.

May our home be a sanctuary of faith, purity, and hospitable love.
Send Thy holy angels to guard our wedding ceremony, our marriage feast, and the beginning of our life together.
Holy Family of Nazareth—Jesus, Mary, and Joseph—bless our union this day and for evermore. Amen.`
  },

  // =========================================================================
  // MARRIAGE STRUGGLES, QUARRELS & PARENTING
  // =========================================================================
  {
    title: "During a Heated Marital Quarrel: Breaking the Wall of Silence and Pride",
    slug: "marital-quarrel-breaking-wall-of-silence-pride",
    category: "marriage",
    category_label: "Marriage & Conflict Resolution",
    tags: ["marriage", "quarrel", "conflict", "silence", "forgiveness", "humility", "peace"],
    content: `> 📜 **Historical & Biblical Origin**: Rooted in Ephesians 4:26 ("Let not the sun go down upon your wrath, neither give place to the devil"), overcoming domestic anger, cold shoulders, and pride.
> 🕯️ **Instructions & Ritual**: Step away to another room. Make the Sign of the Cross. Breathe deeply three times, silencing the urge to formulate defensive arguments before returning to speak.

Lord Jesus Christ, Prince of Peace,
Look upon the anger, coldness, and tension filling our home right now.
Harsh words have been spoken; pride has raised a wall of defensive silence between husband and wife;
and the enemy is whispering lies to magnify our differences and extinguish our love.

Lord, strike down the pride in my own chest!
I confess that I want to be right; I want an apology; I want to defend myself.
Give me instead the humility of Thy Cross.
Teach me how to soften my face, lower my voice, and seek reconciliation rather than victory.

Where I have hurt [Spouse's Name] by sarcasm, coldness, or stubbornness, grant me the courage to say: "Forgive me."
Where I have been wounded, grant me the grace to overlook the offense and forgive from the heart.

Melt the icy silence between us. Let not the sun go down upon our wrath.
Help us to sit down together, to listen with patience, and to renew the covenant of our wedding day.
Through Christ our Lord. Amen.`
  },
  {
    title: "Spouses Facing Incompatibility, Estrangement & Threat of Divorce",
    slug: "spouses-facing-divorce-estrangement-reconciliation",
    category: "marriage",
    category_label: "Marriage Crisis & Reconciliation",
    tags: ["marriage-crisis", "divorce-prevention", "reconciliation", "covenant", "st-rita", "healing"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking the absolute indissolubility of Christian Matrimony (Matthew 19:6: "What therefore God hath joined together, let not man put asunder") and Saint Rita of Cascia, patroness of impossible marriages.
> 🕯️ **Liturgical Setting & Posture**: Prayed when divorce lawyers, separation papers, or emotional estrangement threaten to destroy the home. Kneel before the Crucifix.

O Crucified Lord Jesus,
I come before Thee in absolute desperation.
My marriage is breaking apart; love has grown cold; communication has turned into bitter resentment;
and the threat of divorce and broken vows looms over our household.

Lord, humanly speaking, our situation looks hopeless.
Yet Thou art the God of resurrection, who didst call Lazarus forth from the tomb after four days!
If Thou canst raise the dead, Thou canst resurrect the love, trust, and intimacy that once lived in our marriage.

Drive away from our home the demons of division, infidelity, despair, and hardness of heart.
Heal the deep root of bitterness, unspoken expectations, and ancient grievances.
Softens the hardened heart of [Spouse's Name]; soften my own stubborn heart.

Give us the humility to seek wise Christian counseling.
Shield our children from the devastating trauma of a broken home.
By the blood and water that flowed from Thy pierced side,
re-baptize our marriage covenant, and give us a miracle of reconciliation.
Saint Rita of Cascia, advocate of desperate causes, pray for our marriage! Amen.`
  },
  {
    title: "Single Parent Exhausted Raising Children Alone: Strength and Daily Bread",
    slug: "single-parent-exhausted-raising-children-alone",
    category: "family",
    category_label: "Single Parenting & Strength",
    tags: ["single-parent", "mother", "father", "strength", "exhaustion", "family", "children"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Hagar in the wilderness whom God saw and sustained (Genesis 16:13: "Thou God seest me") and the widow of Zarephath whose jar of flour and jug of oil never failed (1 Kings 17).
    > 🕯️ **Instructions & Posture**: Prayed late at night when the children are finally asleep and the burden of paying bills, disciplining, and cooking alone feels too heavy to bear.

Lord God, Father of the fatherless and Defender of the solitary:

Thou seest my exhaustion tonight.
I am carrying the burden of two parents on my own shoulders.
I work all day, cook meals, help with homework, manage tantrums, pay the bills,
and at the end of the day, there is no one to share the burden, no one to hold me, and no one to say: "You did well."

Lord, be my Partner and Co-Parent in this house.
When my patience wears thin, supply Thine own endless gentle forbearance.
When the bank account runs low, multiply our bread as Thou didst for the widow of Zarephath.
Give me health and stamina to keep working and providing for my children.

Protect my children from feeling abandoned, resentful, or disadvantaged.
Let them grow in holiness, wisdom, and gratitude, knowing that their home is filled with God's presence.
Be a Father to my children, and be my constant strength and shield.
Through Jesus Christ our Savior. Amen.`
  },
  {
    title: "Welcome of an Adopted or Foster Child into the Family Home",
    slug: "welcome-adopted-foster-child-family-home",
    category: "family",
    category_label: "Adoption & Foster Care",
    tags: ["occasion:adoption", "foster-care", "family", "welcome", "healing", "love"],
    content: `> 📜 **Historical & Biblical Origin**: Reflecting our own spiritual adoption as sons and daughters of God (Romans 8:15: "Ye have received the Spirit of adoption, whereby we cry, Abba, Father"), modeling Saint Joseph who welcomed and raised Jesus as his own son.
> 🕯️ **Liturgical Setting & Posture**: Parents lay hands upon the adopted child's head or hold their hands together around the family dinner table.

Heavenly Father, Who hast adopted us into Thine eternal family through Jesus Christ:

We praise and thank Thee today for the holy gift of [Child's Name],
whom Thou hast brought into our hearts and our home through the sacred mystery of adoption / foster care.

Lord, heal any trauma, fear, neglect, or pain this child has suffered in their past.
Uproot any feeling that they are unwanted or second-best.
Graft their spirit securely into the vine of our family tree,
that they may feel unconditionally loved, cherished, and safe beneath our roof.

Give us, as parents, boundless patience to handle behavioral struggles, tears, and testing.
Help our other children and extended family to embrace [Child's Name] with open arms and unreserved warmth.

May our home be for this child a fortress of security and a school of Christian charity,
until we stand together as one unbroken family before the throne of God.
Saint Joseph, foster father of our Lord, guide and protect our family! Amen.`
  },
  {
    title: "The Empty Nest: Parents Whose Last Child Has Left Home",
    slug: "empty-nest-parents-last-child-leaving-home",
    category: "family",
    category_label: "Family Transitions & Empty Nest",
    tags: ["occasion:empty-nest", "family", "parents", "midlife", "marriage", "peace"],
    content: `> 📜 **Historical & Biblical Origin**: Reflecting the presentation of children back to God (Luke 2:22), transitioning from daily hands-on parenting into the wisdom of elderhood and intercession.
> 🕯️ **Liturgical Setting & Posture**: Husband and wife walk through the quiet empty bedrooms of their home, sprinkling holy water or praying together on the sofa.

Lord God of our journey,
How quiet this house has suddenly become.
For decades these rooms were filled with the noise of running feet, slammed doors,
piles of laundry, chaotic school mornings, and late-night talks.
Now the bedrooms are tidy, the car keys are gone, and our last child has stepped into the world.

We thank Thee, Lord, for the privilege of raising these children.
For the tears, the laughter, the lessons, and the grace that preserved our family through every storm.
We release our adult children into Thy divine hands.
Keep them safe, preserve their faith, and guide their career and relationship choices.

And now, Lord, bless this new season of our marriage.
Help husband and wife to look into each other's eyes again with fresh wonder and romance.
Reignite our shared purpose; deliver us from emptiness or purposelessness;
and grant that our golden years may be rich in prayer, hospitality, and generous service to others.
Through Jesus Christ our Lord. Amen.`
  },

  // =========================================================================
  // WORK, WORKPLACE REALITIES & FINANCES
  // =========================================================================
  {
    title: "Morning of a Critical Job Interview: Calm Confidence and Favor (St. Joseph the Worker)",
    slug: "morning-job-interview-calm-confidence-st-joseph",
    category: "work",
    category_label: "Job Search & Interviews",
    tags: ["occasion:job-interview", "work", "career", "st-joseph-worker", "confidence", "favor"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Saint Joseph the Worker, provider for the Holy Family, and Proverbs 16:3: "Commit thy works unto the Lord, and thy thoughts shall be established."
> 🕯️ **Instructions & Posture**: Recite while dressed in professional attire before heading out the door or logging into the video interview. Take three slow, deliberate breaths.

O Blessed Saint Joseph, silent craftsman and diligent worker:

This morning I sit before an interview table / computer screen for a position that could provide bread for my household and advancement for my career.
My palms are sweating and nervousness seeks to cloud my thoughts.

I place this interview into thy hands.
Grant me clarity of mind, an articulate tongue, steady composure, and a warm, humble demeanor.
Help me to highlight my experience, skills, and work ethic with honesty, without exaggeration or false modesty.

Give favor in the eyes of the interviewers, hiring managers, and committee members.
Restrain all prejudice, bias, or misunderstanding.

Lord, if this job is for my spiritual and temporal good, open the door wide and grant me this position.
If it is not Thy will, give me the peace to accept the rejection, knowing that Thou hast a better path prepared for me.
Saint Joseph the Worker, pray for me! Amen.`
  },
  {
    title: "First Day at a New Job: Overcoming Imposter Syndrome and Anxiety",
    slug: "first-day-new-job-overcoming-imposter-syndrome",
    category: "work",
    category_label: "Career Transitions & New Job",
    tags: ["occasion:first-day-job", "new-job", "work", "imposter-syndrome", "peace", "excellence"],
    content: `> 📜 **Historical & Biblical Origin**: Grounded in Joshua 1:9 ("Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest").
> 🕯️ **Liturgical Setting & Posture**: Prayed in the parking lot, train station, or at the desk during the first five minutes of arrival.

Lord God of Wisdom and Might,
I step into this new office / workplace today with butterflies in my stomach.
Everything is unfamiliar: new faces, new software, new procedures, and new expectations.
The voice of insecurity whispers that I am an imposter, that I will make foolish mistakes,
or that I am not qualified for this responsibility.

I reject those lies in the Name of Jesus Christ!
Thou hast opened the door to this job; Thou hast equipped me with intellect and skills;
and Thy Holy Spirit accompanies me into this building.

Give me a quick mind to learn procedures, humility to ask questions when I do not understand,
and the grace to make a positive, respectful impression upon my supervisors and colleagues.
Preserve me from reckless errors.
May my labor be marked by excellence, punctuality, honesty, and kindness.

Let me be a light of integrity and calm peace in this workplace.
In Jesus' Holy Name. Amen.`
  },
  {
    title: "Toxic Workplace: Dealing with an Unfair Boss, Hostile Colleagues, and Gossip",
    slug: "toxic-workplace-dealing-with-unfair-boss-gossip",
    category: "work",
    category_label: "Workplace Dignity & Peace",
    tags: ["toxic-workplace", "work", "difficult-boss", "hostility", "patience", "integrity", "boundaries"],
    content: `> 📜 **Historical & Biblical Origin**: Reflecting Christ's endurance of injustice before the Sanhedrin (1 Peter 2:23: "Who, when he was reviled, reviled not again; when he suffered, he threatened not; but committed himself to him that judgeth righteously").
> 🕯️ **Instructions & Posture**: Recite in your car before entering the office or during a restroom break when workplace microaggressions, hostility, or unfair criticisms become suffocating.

Lord Jesus Christ,
Thou who didst walk amidst wolves and false accusers without losing Thy divine peace:

I bring before Thee the heavy burden of my workplace.
Thou knowest the toxic environment, the micromanagement, the unfair criticisms of my boss,
the office gossip, and the politics that make each workday an exhausting battle.

Lord, place an invisible shield around my heart and mind.
Let not their bitterness penetrate my soul or steal my joy.
Restrain my tongue from answering malice with malice, or gossip with gossip.
Give me supernatural patience, professional excellence, and firm, healthy boundaries.

Expose the lies and protect my reputation from false reports.
If it be possible, soften the hearts of my supervisors and difficult coworkers.
And if this season of trial has reached its end, open a door of escape to a healthy, dignified workplace
where my gifts are respected and compensated fairly.

Until then, keep me faithful, honest, and peaceful in the midst of the storm.
Through Christ our Lord. Amen.`
  },
  {
    title: "Day of Demotion, Downsizing, or Unexpected Layoff: Trusting in the Desert",
    slug: "demotion-downsizing-unexpected-layoff-trust",
    category: "work",
    category_label: "Job Loss & Downsizing",
    tags: ["job-loss", "layoff", "downsizing", "unemployment", "finances", "trust", "identity"],
    content: `> 📜 **Historical & Biblical Origin**: Invoking Job's steadfast confession (Job 1:21: "The Lord gave, and the Lord hath taken away; blessed be the name of the Lord") and Jesus' promise that our Heavenly Father knows what we need before we ask (Matthew 6:31-33).
> 🕯️ **Instructions & Posture**: Prayed on the afternoon of termination, sitting in the car with your severance box or at the kitchen table facing financial shock.

Lord God of my salvation,
The blow has fallen. In an instant, my position has been eliminated, my badge collected,
my salary severed, and my future thrown into financial uncertainty.
Shock, humiliation, fear, and betrayal are fighting for control of my heart.

Lord, anchor my soul in the rock of Thy truth.
My worth as a human being does not come from a company title, an email address, or a paycheck.
I am a son / daughter of God, bought with the Precious Blood of Jesus Christ.

Forgive those who made this decision; deliver my heart from consuming bitterness.
Provide for my family's mortgage, groceries, health insurance, and daily necessities.
Do not let the enemy tempt me to despair or panic.

Close this door firmly, and lead me to the next chapter of my life.
Use this wilderness season to refine my faith, deepen my family's unity,
and redirect my career into work that brings greater honor to Thy Name and blessing to my household.
In Jesus' Name, I trust in Thee! Amen.`
  }
];

async function seedEncyclopedicPrayersPart4() {
  console.log(`Starting to seed ${ENCYCLOPEDIC_PRAYERS_PART4.length} encyclopedic prayers (Part 4 - Life Situations)...`);

  for (const prayer of ENCYCLOPEDIC_PRAYERS_PART4) {
    try {
      const existing = await prisma.prayer.findFirst({
        where: { slug: prayer.slug }
      });

      if (existing) {
        await prisma.prayer.update({
          where: { id: existing.id },
          data: {
            title: prayer.title,
            category: prayer.category,
            category_label: prayer.category_label,
            content: prayer.content,
            tags: prayer.tags,
            is_active: true
          }
        });
        console.log(`Updated prayer: "${prayer.title}"`);
      } else {
        const created = await prisma.prayer.create({
          data: {
            title: prayer.title,
            slug: prayer.slug,
            category: prayer.category,
            category_label: prayer.category_label,
            content: prayer.content,
            tags: prayer.tags,
            is_active: true
          }
        });
        console.log(`Created prayer [ID: ${created.id}]: "${prayer.title}"`);
      }
    } catch (err) {
      console.error(`Error processing prayer "${prayer.title}":`, err.message);
    }
  }

  const count = await prisma.prayer.count();
  console.log(`Done! Total prayers in database: ${count}`);
}

seedEncyclopedicPrayersPart4()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
