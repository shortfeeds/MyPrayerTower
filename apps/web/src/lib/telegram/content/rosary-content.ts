export interface RosaryMystery {
    name: string;
    days: string[];
    decades: {
        title: string;
        fruit: string;
        scripture: string;
        meditation: string;
    }[];
}

export const ROSARY_CONTENT: Record<string, RosaryMystery> = {
    joyful: {
        name: "Joyful Mysteries",
        days: ["Monday", "Saturday"],
        decades: [
            {
                title: "1. The Annunciation",
                fruit: "Humility",
                scripture: "\"Behold the handmaid of the Lord; be it done to me according to thy word.\" (Luke 1:38)",
                meditation: "Mary says Yes to God. We pray for the grace to accept God's will in our own lives with humility and trust."
            },
            {
                title: "2. The Visitation",
                fruit: "Love of Neighbor",
                scripture: "\"And whence is this to me, that the mother of my Lord should come to me?\" (Luke 1:43)",
                meditation: "Mary hastens to help Elizabeth. We pray for a spirit of service and charity towards those in need."
            },
            {
                title: "3. The Nativity",
                fruit: "Poverty of Spirit",
                scripture: "\"And she brought forth her firstborn son, and wrapped him in swaddling clothes.\" (Luke 2:7)",
                meditation: "Jesus is born in a stable. We pray for detachment from material things and adding room for Jesus in our hearts."
            },
            {
                title: "4. The Presentation",
                fruit: "Obedience",
                scripture: "\"They took him up to Jerusalem to present him to the Lord.\" (Luke 2:22)",
                meditation: "Mary and Joseph obey the law. We pray for the grace to be obedient to God's commandments."
            },
            {
                title: "5. The Finding in the Temple",
                fruit: "Joy in Finding Jesus",
                scripture: "\"Did you not know that I must be in my Father's house?\" (Luke 2:49)",
                meditation: "Jesus is found teaching. We pray for the grace to always seek Jesus and find Him in our daily lives."
            }
        ]
    },
    sorrowful: {
        name: "Sorrowful Mysteries",
        days: ["Tuesday", "Friday"],
        decades: [
            {
                title: "1. The Agony in the Garden",
                fruit: "Sorrow for Sin",
                scripture: "\"Father, if thou wilt, remove this chalice from me: but yet not my will, but thine be done.\" (Luke 22:42)",
                meditation: "Jesus prays in anguish. We pray for true contrition for our sins and conformity to God's will."
            },
            {
                title: "2. The Scourging at the Pillar",
                fruit: "Purity",
                scripture: "\"Then Pilate took Jesus, and scourged him.\" (John 19:1)",
                meditation: "Jesus suffers cruel tortures. We pray for the grace of purity and self-denial."
            },
            {
                title: "3. The Crowning with Thorns",
                fruit: "Moral Courage",
                scripture: "\"And plaiting a crown of thorns, they put it upon his head.\" (Mark 15:17)",
                meditation: "Jesus is mocked as King. We pray for the courage to stand up for our faith despite ridicule."
            },
            {
                title: "4. The Carrying of the Cross",
                fruit: "Patience",
                scripture: "\"And bearing his own cross, he went forth to that place which is called Calvary.\" (John 19:17)",
                meditation: "Jesus carries the heavy wood. We pray for patience in bearing our own daily crosses."
            },
            {
                title: "5. The Crucifixion",
                fruit: "Perseverance",
                scripture: "\"Father, into thy hands I commend my spirit.\" (Luke 23:46)",
                meditation: "Jesus dies for us. We pray for the grace of final perseverance and to forgive those who hurt us."
            }
        ]
    },
    glorious: {
        name: "Glorious Mysteries",
        days: ["Wednesday", "Sunday"],
        decades: [
            {
                title: "1. The Resurrection",
                fruit: "Faith",
                scripture: "\"He is not here. For he is risen, as he said.\" (Matthew 28:6)",
                meditation: "Jesus conquers death. We pray for a strong and lively faith in God's promises."
            },
            {
                title: "2. The Ascension",
                fruit: "Hope",
                scripture: "\"So then the Lord Jesus, after he had spoken to them, was taken up into heaven.\" (Mark 16:19)",
                meditation: "Jesus returns to the Father. We pray for the theological virtue of hope and desire for heaven."
            },
            {
                title: "3. The Descent of the Holy Spirit",
                fruit: "Love of God",
                scripture: "\"And they were all filled with the Holy Ghost.\" (Acts 2:4)",
                meditation: "The Spirit empowers the Church. We pray for the gifts of the Holy Spirit and zeal for souls."
            },
            {
                title: "4. The Assumption",
                fruit: "Grace of a Happy Death",
                scripture: "\"Arise, make haste, my love, my dove, my beautiful one, and come.\" (Song of Songs 2:10)",
                meditation: "Mary is taken up body and soul. We pray for a holy life and a happy death."
            },
            {
                title: "5. The Coronation",
                fruit: "Trust in Mary's Intercession",
                scripture: "\"A great sign appeared in heaven: A woman clothed with the sun.\" (Revelation 12:1)",
                meditation: "Mary is Queen of Heaven. We pray for trust in her maternal intercession."
            }
        ]
    },
    luminous: {
        name: "Luminous Mysteries",
        days: ["Thursday"],
        decades: [
            {
                title: "1. The Baptism in the Jordan",
                fruit: "Openness to the Holy Spirit",
                scripture: "\"This is my beloved Son, in whom I am well pleased.\" (Matthew 3:17)",
                meditation: "Jesus is baptized. We pray to live out our baptismal promises faithfully."
            },
            {
                title: "2. The Wedding at Cana",
                fruit: "To Jesus through Mary",
                scripture: "\"Whatsoever he shall say to you, do ye.\" (John 2:5)",
                meditation: "Jesus performs his first miracle. We pray to trust in Mary's guidance to her Son."
            },
            {
                title: "3. The Proclamation of the Kingdom",
                fruit: "Repentance",
                scripture: "\"Repent, and believe in the Gospel.\" (Mark 1:15)",
                meditation: "Jesus preaches conversion. We pray for a repentant heart and conversion of sinners."
            },
            {
                title: "4. The Transfiguration",
                fruit: "Desire for Holiness",
                scripture: "\"And he was transfigured before them. And his face did shine as the sun.\" (Matthew 17:2)",
                meditation: "Jesus reveals his glory. We pray for the grace to be transformed by Christ."
            },
            {
                title: "5. The Institution of the Eucharist",
                fruit: "Adoration",
                scripture: "\"Take ye, and eat. This is my body.\" (Matthew 26:26)",
                meditation: "Jesus gives us Himself. We pray for a deep love and reverence for the Holy Eucharist."
            }
        ]
    }
};
