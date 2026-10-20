/**
 * 更換內容只要修改這個檔案。
 * image 位置可以改成 assets/你的檔名.png。
 * 每一組 pages 是一個雙頁跨頁，最後一組是封底／團隊分工。
 */
window.BOOK_CONTENT = [
  {
    id: 'intro', menu: '遊戲簡介', chapter: 'CHAPTER 01',
    left: { type: 'image', image: 'assets/intro-cutscene.png', tag: '', title: '冒險，由此開始', caption: '過場動畫' },
    right: { type: 'text', title: '遊戲簡介', subtitle: 'What is ClimbJack?', paragraphs: ['很久很久以前，有位少年Jack得到了一顆神奇的魔豆。沒想到，這顆種子竟會引領他展開一場前所未有的冒險。', '《Climb! Jack!》是一款以經典童話為靈感的 2D 像素風平台冒險遊戲。玩家將運用藤蔓與多種移動技巧，向未知的天空探索。'], chips: ['2D像素風格', '冒險遊戲', '傑克與魔豆'] }
  },
  {
    id: 'story', menu: '故事背景', chapter: 'CHAPTER 02',
    left: { type: 'panorama', image: 'assets/village-scene.png', tag: 'STORY ART', title: '村莊長卷', caption: '左右拖動，探索完整場景。' },
    right: { type: 'text', title: '故事背景', subtitle: 'Story', paragraphs: ['在一個土地逐漸乾枯的小村莊裡，傑克和家人過著平凡卻困苦的日子。', '一次意想不到的交換，讓他獲得一顆神秘魔豆。當藤蔓直衝雲端，命運的篇章也悄悄翻開……'] }
  },
  {
    id: 'gameplay', menu: '玩法特色', chapter: 'CHAPTER 03',
    left: { type: 'image', image: '', tag: 'GAMEPLAY', title: '向上探索', caption: '尚無實際遊玩截圖，後續再替換。' },
    right: { type: 'features', title: '玩法特色', subtitle: 'HOW TO PLAY', features: [['🌱', '魔豆藤蔓', '種下魔豆，創造探索路線。'], ['🧗', '攀爬移動', '掌握節奏，挑戰垂直地形。'], ['🍃', '盪藤與滑翔', '靈活穿梭於天空與平台之間。']] }
  },
  {
    id: 'characters', menu: '人物介紹', chapter: 'CHAPTER 04',
    left: { type: 'image', image: 'assets/jack-idle.gif', tag: 'CHARACTER ART', title: 'Jack', caption: '傑克的待機動畫。' },
    right: { type: 'text', title: '人物介紹', subtitle: 'MEET THE CHARACTERS', paragraphs: ['JACK｜有些許衝動，對事物充滿好奇心的少年。', '本性善良，對家人與家園懷有責任感與愛護之情。並不是天生無所畏懼的真勇者，但他願意在面臨困難時往前衝，展現出真實而真摯的勇氣。', '平凡的小人物：他既不是騎士、也不是王子或魔法師，而只是一個生活在貧窮村莊裡的普通少年。'] }
  },
  {
    id: 'world', menu: '關卡場景', chapter: 'CHAPTER 05',
    left: { type: 'image', image: 'assets/world-beanstalk.png', tag: 'WORLD ART', title: '從村莊到雲端', caption: '魔豆藤蔓的過場插畫。' },
    right: { type: 'text', title: '關卡場景', subtitle: 'EXPLORE THE WORLD', paragraphs: ['01｜乾枯村莊：一切故事的起點。', '02｜巨型藤蔓：通往未知高空的冒險之路。', '03｜巨人城堡：藏在雲層之上的神秘世界。'] }
  },
  {
    id: 'development', menu: '製作過程', chapter: 'CHAPTER 06',
    left: { type: 'image', image: '', tag: 'BEHIND THE SCENES', title: '製作的足跡', caption: 'pic補。' },
    right: { type: 'text', title: '製作過程', subtitle: 'THE MAKING OF', paragraphs: ['從遊戲企劃、敘事設定、像素美術，到角色動作與關卡系統，每一步都是團隊共同累積的成果。', '。'] }
  },
  {
    id: 'credits', menu: '團隊分工', chapter: 'THE END',
    left: { type: 'text', title: '致，冒險的你', subtitle: 'THANK YOU FOR READING', paragraphs: ['每段旅程都有終點，但故事仍會繼續。', '感謝你翻閱《Climb! Jack!》的冒險童話。', 'THE END ✦'] },
    right: {
  type: 'credits',
  title: '團隊分工',
  subtitle: 'CREATED BY',
  members: [
    ['蔣嘉芸', '美術、劇情文案'],
    ['黃偉航', '遊戲企劃與程式開發']
  ]
}
  }
];
