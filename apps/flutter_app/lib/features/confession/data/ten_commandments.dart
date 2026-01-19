/// Examination of Conscience Model
class ExaminationItem {
  final int commandmentNumber;
  final String commandment;
  final String description;
  final List<String> questions;

  const ExaminationItem({
    required this.commandmentNumber,
    required this.commandment,
    required this.description,
    required this.questions,
  });
}

/// All Ten Commandments with their examination questions
const List<ExaminationItem> tenCommandmentsExamination = [
  ExaminationItem(
    commandmentNumber: 1,
    commandment:
        'I am the Lord your God; you shall not have strange gods before Me.',
    description: 'This commandment calls us to put God first in our lives.',
    questions: [
      'Have I doubted or denied the existence of God?',
      'Have I refused to believe what God has revealed?',
      'Have I believed in superstition, horoscopes, fortune telling, or the occult?',
      'Have I denied being Catholic out of fear or to fit in?',
      'Have I despaired of God\'s mercy?',
      'Have I presumed on God\'s mercy, sinning willfully?',
      'Have I loved anyone or anything more than God?',
      'Have I given time to daily prayer?',
      'Have I neglected learning about my faith?',
      'Have I received Communion in a state of mortal sin?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 2,
    commandment: 'You shall not take the name of the Lord your God in vain.',
    description: 'This commandment calls us to respect God\'s holy name.',
    questions: [
      'Have I used God\'s name carelessly or in anger?',
      'Have I cursed using God\'s name or sacred things?',
      'Have I broken an oath or vow made before God?',
      'Have I spoken disrespectfully about sacred things?',
      'Have I used blasphemy or sacrilege?',
      'Have I complained against God in adversity?',
      'Have I called down evil upon anyone or anything?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 3,
    commandment: 'Remember to keep holy the Lord\'s Day.',
    description:
        'This commandment calls us to worship God and rest on Sundays.',
    questions: [
      'Have I missed Mass on Sunday or Holy Days through my own fault?',
      'Have I arrived at Mass late or left early without serious reason?',
      'Have I been inattentive or distracted during Mass?',
      'Have I done unnecessary work on Sunday?',
      'Have I failed to make Sunday a day of prayer, rest, and family time?',
      'Have I made others work on Sunday unnecessarily?',
      'Have I received Holy Communion with proper reverence?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 4,
    commandment: 'Honor your father and your mother.',
    description:
        'This commandment calls us to respect our parents and authorities.',
    questions: [
      'Have I disobeyed or disrespected my parents?',
      'Have I neglected my duties to my family?',
      'Have I failed to care for aging parents?',
      'Have I been disrespectful to teachers or those in authority?',
      'Have I caused family discord or failed to forgive family members?',
      'Have I given bad example to my children?',
      'Have I failed to educate my children in the faith?',
      'Have I failed to provide for my family\'s needs?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 5,
    commandment: 'You shall not kill.',
    description: 'This commandment calls us to respect all human life.',
    questions: [
      'Have I killed or physically harmed another person?',
      'Have I had an abortion or encouraged one?',
      'Have I abused alcohol, drugs, or food?',
      'Have I attempted suicide or seriously considered it?',
      'Have I endangered my life or others through reckless behavior?',
      'Have I given scandal by leading others into sin?',
      'Have I been angry, hateful, or resentful toward others?',
      'Have I refused to forgive someone?',
      'Have I been cruel or mean to others?',
      'Have I bullied or harassed anyone?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 6,
    commandment: 'You shall not commit adultery.',
    description: 'This commandment calls us to purity in thought and action.',
    questions: [
      'Have I committed adultery or fornication?',
      'Have I viewed pornography or impure images?',
      'Have I engaged in impure thoughts deliberately?',
      'Have I used impure language or told impure jokes?',
      'Have I dressed immodestly?',
      'Have I committed impure acts alone?',
      'Have I used contraception?',
      'Have I disrespected the sanctity of marriage?',
      'Have I been unfaithful to my spouse in thought or deed?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 7,
    commandment: 'You shall not steal.',
    description: 'This commandment calls us to respect others\' property.',
    questions: [
      'Have I stolen anything?',
      'Have I cheated anyone?',
      'Have I failed to pay debts or return borrowed items?',
      'Have I damaged someone else\'s property?',
      'Have I been dishonest in business dealings?',
      'Have I wasted time at work?',
      'Have I accepted stolen goods?',
      'Have I lived beyond my means?',
      'Have I been greedy or excessively attached to possessions?',
      'Have I failed to give to the poor when able?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 8,
    commandment: 'You shall not bear false witness against your neighbor.',
    description: 'This commandment calls us to truth and honesty.',
    questions: [
      'Have I lied?',
      'Have I gossiped or spread rumors?',
      'Have I damaged someone\'s reputation?',
      'Have I revealed secrets without good reason?',
      'Have I made rash judgments about others?',
      'Have I practiced flattery or hypocrisy?',
      'Have I failed to speak up in defense of truth?',
      'Have I exaggerated or boasted?',
      'Have I been two-faced or insincere?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 9,
    commandment: 'You shall not covet your neighbor\'s wife.',
    description: 'This commandment calls us to purity of heart.',
    questions: [
      'Have I dwelt on impure thoughts about others?',
      'Have I desired another person\'s spouse?',
      'Have I looked at others lustfully?',
      'Have I entertained sexual fantasies?',
      'Have I failed to guard my eyes and imagination?',
      'Have I failed to avoid occasions of impurity?',
      'Have I consumed media that encourages impurity?',
    ],
  ),
  ExaminationItem(
    commandmentNumber: 10,
    commandment: 'You shall not covet your neighbor\'s goods.',
    description: 'This commandment calls us to contentment and generosity.',
    questions: [
      'Have I been envious of what others have?',
      'Have I been jealous of others\' success?',
      'Have I been greedy or materialistic?',
      'Have I been discontent with what God has given me?',
      'Have I wished ill upon others?',
      'Have I been wasteful or extravagant?',
      'Have I failed to be grateful for my blessings?',
      'Have I been selfish with my time, talent, or treasure?',
    ],
  ),
];
