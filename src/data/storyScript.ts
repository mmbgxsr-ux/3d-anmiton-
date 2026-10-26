import { DialogueLine, SceneMeta } from '../types';

export const SCENES: SceneMeta[] = [
  {
    id: 1,
    titleAr: 'المشهد الأول: الزهق والملل',
    titleEn: 'Scene 1: Boredom & Homework Struggles',
    startTime: 0,
    endTime: 10,
    duration: 10,
    descriptionAr: 'زيزو يجلس على مكتبه يشعر بالإحباط الشديد من مسائل الرياضيات، يتثاءب ويسند رأسه بيأس.',
    mood: 'ملل وكوميديا هادئة'
  },
  {
    id: 2,
    titleAr: 'المشهد الثاني: ظهور الروبوت المنقذ',
    titleEn: 'Scene 2: Enter Roby the Blue Hero',
    startTime: 10,
    endTime: 20,
    duration: 10,
    descriptionAr: 'وميض سحري وظهور روبوت أزرق صغير يطير بمرح ويعرض حل الواجب في ثانية، زيزو ينبهر بفرحة عارمة.',
    mood: 'حماس ومفاجأة سحرية'
  },
  {
    id: 3,
    titleAr: 'المشهد الثالث: الصدمة والقفلة الكوميدية',
    titleEn: 'Scene 3: The Comedic Twist & Punchline',
    startTime: 20,
    endTime: 30,
    duration: 10,
    descriptionAr: 'الروبوت يفحص الكشكول بليزر متطور.. ثم يسأل زيزو (1 + 1 كام؟ وريني شطارتك وحلها!) وزيزو يصاب بذهول كوميدي.',
    mood: 'مفارقة وقفشة مصرية مضحكة'
  }
];

export const DIALOGUE_SCRIPT: DialogueLine[] = [
  {
    id: 'd1',
    speaker: 'zizo',
    speakerNameAr: 'زيزو',
    textAr: 'يووووه بقى! هي المسائل دي مش هتخلص ولا إيه؟',
    phoneticEg: 'Yoooh ba\'a! Heya el-masa\'el di mesh hatikhlas wala eh?',
    textEn: 'Ugh, come on! Will these math problems ever end?',
    startTime: 1.0,
    endTime: 4.8,
    expression: 'bored',
    soundFxCue: 'clock_tick'
  },
  {
    id: 'd2',
    speaker: 'zizo',
    speakerNameAr: 'زيزو',
    textAr: 'دماغي ساحت.. نفسي في معجزة تخلّص الواجب ده بدالي!',
    phoneticEg: 'Dmaghi sahat.. nefsi fi mo\'geza tkhallas el-wageb da badali!',
    textEn: 'My brain melted.. I just need a miracle to solve this for me!',
    startTime: 5.2,
    endTime: 9.2,
    expression: 'yawn',
    soundFxCue: 'sigh'
  },
  {
    id: 'd3',
    speaker: 'roby',
    speakerNameAr: 'روبي 3000',
    textAr: 'مساء الجمال يا بطل! أنا الروبوت "شاطر 3000".. جاي أحللك أي واجب في ثانية واحدة!',
    phoneticEg: 'Masaa el-gamal ya batal! Ana el-robot Shatir 3000.. gay ahellelak ay wageb fi sanya!',
    textEn: 'Good evening champion! I am robot Shatir 3000.. here to solve all your homework in a second!',
    startTime: 11.2,
    endTime: 15.6,
    expression: 'happy',
    soundFxCue: 'teleport_sparkle'
  },
  {
    id: 'd4',
    speaker: 'zizo',
    speakerNameAr: 'زيزو',
    textAr: 'بجد والله؟! طب والنبي إلحقني يا باشا في المسألة دي.. شكلها معقد قوي!',
    phoneticEg: 'Bgad wallahi?! Tab wel-nabi elha\'ni ya basha fel mas\'ala di.. shaklaha mo\'aqad awi!',
    textEn: 'Really for real?! Please save me chief on this problem.. it looks super complex!',
    startTime: 16.0,
    endTime: 19.6,
    expression: 'curious',
    soundFxCue: 'cheer'
  },
  {
    id: 'd5',
    speaker: 'roby',
    speakerNameAr: 'روبي 3000',
    textAr: 'بييب بووب! جاري فحص المسألة.. تم تحليل المسألة بنجاح!',
    phoneticEg: 'Beep boop! Gary fahss el-mas\'ala.. tamm el-tahleel bi-najah!',
    textEn: 'Beep boop! Scanning question.. analysis completed successfully!',
    startTime: 20.3,
    endTime: 22.8,
    expression: 'thinking',
    soundFxCue: 'laser_scan'
  },
  {
    id: 'd6',
    speaker: 'roby',
    speakerNameAr: 'روبي 3000',
    textAr: 'المسألة بتقول: واحد زائد واحد كام؟ وريني شطارتك بقى يا زيزو وحلها أنت!',
    phoneticEg: 'El mas\'ala bet\'oul: Wahed za\'ed wahed kam? Warreenni shatartak ba\'a ya Zizo we helleha enta!',
    textEn: 'The question says: 1 + 1 equals what? Show me your skills Zizo and solve it yourself!',
    startTime: 23.2,
    endTime: 26.2,
    expression: 'happy',
    soundFxCue: 'robot_chuckle'
  },
  {
    id: 'd7',
    speaker: 'zizo',
    speakerNameAr: 'زيزو',
    textAr: 'نعـــــم؟! ما لو كنت عارف ما كنتش ندهتلك يا فالح!!',
    phoneticEg: 'Na\'aaaaam?! Ma law kont \'aref makontesh nadahtelak ya faleh!!',
    textEn: 'WHA-A-AT?! If I knew the answer, I wouldn\'t have called you, genius!!',
    startTime: 26.6,
    endTime: 29.5,
    expression: 'shocked',
    soundFxCue: 'comic_fail'
  }
];
