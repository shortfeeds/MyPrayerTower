// import 'package:flutter/material.dart';

enum LiturgyHour {
  vigils, // Office of Readings (Middle of night/early morning)
  lauds, // Morning Prayer (6am-9am)
  terce, // Mid-Morning (9am-12pm)
  sext, // Mid-Day (12pm-3pm)
  none, // Afternoon (3pm-6pm)
  vespers, // Evening Prayer (6pm-9pm)
  compline, // Night Prayer (9pm-Midnight)
}

class DivineOfficeData {
  static LiturgyHour getHourForTime(DateTime now) {
    final hour = now.hour;
    if (hour < 6) return LiturgyHour.vigils;
    if (hour < 9) return LiturgyHour.lauds;
    if (hour < 12) return LiturgyHour.terce;
    if (hour < 15) return LiturgyHour.sext;
    if (hour < 18) return LiturgyHour.none;
    if (hour < 21) return LiturgyHour.vespers;
    return LiturgyHour.compline;
  }

  static String getName(LiturgyHour hour) {
    switch (hour) {
      case LiturgyHour.vigils:
        return 'Office of Readings';
      case LiturgyHour.lauds:
        return 'Morning Prayer';
      case LiturgyHour.terce:
        return 'Mid-Morning Prayer';
      case LiturgyHour.sext:
        return 'Mid-Day Prayer';
      case LiturgyHour.none:
        return 'Afternoon Prayer';
      case LiturgyHour.vespers:
        return 'Evening Prayer';
      case LiturgyHour.compline:
        return 'Night Prayer';
    }
  }

  static String getDescription(LiturgyHour hour) {
    switch (hour) {
      case LiturgyHour.vigils:
        return 'A meditative office of psalms and scripture readings, traditionally prayed before dawn.';
      case LiturgyHour.lauds:
        return 'Consecrating the morning to God with praise and thanksgiving for the new day.';
      case LiturgyHour.terce:
        return 'Recalling the descent of the Holy Spirit upon the apostles at the third hour.';
      case LiturgyHour.sext:
        return 'A pause in the midst of the day\'s work to remember Christ\'s crucifixion.';
      case LiturgyHour.none:
        return 'Identifying with Christ\'s death on the cross at the ninth hour.';
      case LiturgyHour.vespers:
        return 'Thanksgiving for the day\'s graces and remembrance of the Last Supper.';
      case LiturgyHour.compline:
        return 'A quiet prayer of protection and examination of conscience before sleep.';
    }
  }

  static Map<String, dynamic> getContent(LiturgyHour hour) {
    // This is a placeholder for real API data.
    // In a real app, this would fetch the proper readings for the day.
    // Here we provide a static structure for demonstration.

    return {
      'hymn': 'Come, Holy Ghost, Creator Blest',
      'psalm1': {
        'antiphon': 'The Lord is my shepherd; there is nothing I shall want.',
        'reference': 'Psalm 23',
        'text': '''
The Lord is my shepherd; there is nothing I shall want.
Fresh and green are the pastures where he gives me repose.
Near restful waters he leads me, to revive my drooping spirit.
He guides me along the right path; he is true to his name.

If I should walk in the valley of darkness no evil would I fear.
You are there with your crook and your staff; with these you give me comfort.

You have prepared a banquet for me in the sight of my foes.
My head you have anointed with oil; my cup is overflowing.

Surely goodness and kindness shall follow me all the days of my life.
In the Lord's own house shall I dwell for ever and ever.
''',
      },
      'reading': {
        'reference': 'Romans 12:1-2',
        'text':
            'I urge you therefore, brothers, by the mercies of God, to offer your bodies as a living sacrifice, holy and pleasing to God, your spiritual worship. Do not conform yourselves to this age but be transformed by the renewal of your mind, that you may discern what is the will of God, what is good and pleasing and perfect.',
      },
      'response':
          'R. Christ, Son of the living God, have mercy on us.\nV. You are seated at the right hand of the Father.',
      'canticle': {
        'name': hour == LiturgyHour.lauds
            ? 'Benedictus'
            : (hour == LiturgyHour.vespers
                  ? 'Magnificat'
                  : (hour == LiturgyHour.compline
                        ? 'Nunc Dimittis'
                        : 'Praise of God')),
        'text': _getCanticleText(hour),
      },
      'prayer':
          'Almighty God, as we offer you our worship at this hour, keep our hearts and minds in your peace. Through Christ our Lord. Amen.',
    };
  }

  static String _getCanticleText(LiturgyHour hour) {
    switch (hour) {
      case LiturgyHour.lauds:
        return '''
Blessed be the Lord, the God of Israel;
he has come to his people and set them free.
He has raised up for us a mighty savior,
born of the house of his servant David.

Through his holy prophets he promised of old
that he would save us from our enemies,
from the hands of all who hate us.
He promised to show mercy to our fathers
and to remember his holy covenant.

This was the oath he swore to our father Abraham:
to set us free from the hands of our enemies,
free to worship him without fear,
holy and righteous in his sight
all the days of our life.

You, my child, shall be called the prophet of the Most High;
for you will go before the Lord to prepare his way,
to give his people knowledge of salvation
by the forgiveness of their sins.

In the tender compassion of our God
the dawn from on high shall break upon us,
to shine on those who dwell in darkness and the shadow of death,
and to guide our feet into the way of peace.
''';
      case LiturgyHour.vespers:
        return '''
My soul proclaims the greatness of the Lord,
my spirit rejoices in God my Savior
for he has looked with favor on his lowly servant.
From this day all generations will call me blessed:
the Almighty has done great things for me,
and holy is his Name.

He has mercy on those who fear him
in every generation.
He has shown the strength of his arm,
he has scattered the proud in their conceit.

He has cast down the mighty from their thrones,
and has lifted up the lowly.
He has filled the hungry with good things,
and the rich he has sent away empty.

He has come to the help of his servant Israel
for he has remembered his promise of mercy,
the promise he made to our fathers,
to Abraham and his children for ever.
''';
      case LiturgyHour.compline:
        return '''
Lord, now you let your servant go in peace;
your word has been fulfilled:
my own eyes have seen the salvation
which you have prepared in the sight of every people:
a light to reveal you to the nations
and the glory of your people Israel.
''';
      default:
        return '''
We praise you, O God,
we acclaim you as the Lord;
all creation worships you,
the Father everlasting.
To you all angels, all the powers of heaven,
the Cherubim and Seraphim,
sing in endless praise:
Holy, Holy, Holy, Lord God of hosts,
heaven and earth are full of your glory.
''';
    }
  }
}
