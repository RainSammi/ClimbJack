/**
 * 更換內容只要修改這個檔案。
 * 圖片可用 images: ['assets/3-1.png', ...] 設定輪播，新增同編號圖片時也請加入陣列。
 * 每一組 pages 是一個雙頁跨頁，最後一組是封底／團隊分工。
 */
window.BOOK_CONTENT = [
  {
    id: 'intro', menu: '遊戲簡介', chapter: 'CHAPTER 01',
    left: { type: 'image', image: 'assets/1.png', tag: '', title: '冒險，由此開始', caption: '遊戲主頁面' },
    right: { type: 'text', title: '遊戲簡介', subtitle: 'What is ClimbJack?', paragraphs: ['很久很久以前，有位少年Jack得到了一顆神奇的魔豆。沒想到，這顆種子竟會引領他展開一場前所未有的冒險。', '《Climb Jack!》是一款以經典童話為靈感的 2D 像素風平台冒險遊戲。玩家將運用藤蔓與多種移動技巧，向未知的天空探索。'], chips: ['2D像素風格', '冒險遊戲', '傑克與魔豆'] }
  },
  {
    id: 'story', menu: '故事背景', chapter: 'CHAPTER 02',
    left: { type: 'panorama', image: 'assets/2.png', tag: 'STORY ART', title: '村莊長卷', caption: '左右拖動，探索完整場景。' },
    right: { type: 'text', title: '故事背景', subtitle: 'Story', paragraphs: ['在一個土地逐漸乾枯的小村莊裡，傑克和家人過著平凡卻困苦的日子。', '一次意想不到的交換，讓他獲得一顆神秘魔豆。當藤蔓直衝雲端，命運的篇章也悄悄翻開……'] }
  },
  {
    id: 'gameplay', menu: '玩法特色', chapter: 'CHAPTER 03',
    left: { type: 'gallery', images: ['assets/3-1.png','assets/3-2.png','assets/3-3.png'], tag: 'GAMEPLAY', title: '向上探索', caption: '使用左右箭頭或左右滑動切換圖片。' },
    right: { type: 'features', title: '玩法特色', subtitle: 'HOW TO PLAY', features: [['【一】', '擺盪藤蔓', '靈活穿梭於天空與平台之間。'], ['【二】', '種下魔豆', '生長小藤蔓，創造探索路線。'], ['【三】', '數量限制', '數量有限，智取通關!']] }
  },
  {
    id: 'characters', menu: '人物介紹', chapter: 'CHAPTER 04',
    left: { type: 'gallery', pixel: true, images: ['assets/gif/jack/jack_idle.gif','assets/gif/jack/jack_front.gif','assets/gif/jack/jack_back.gif','assets/gif/jack/jack_run.gif','assets/gif/jack/jack_dash.gif','assets/gif/jack/jack_jump.gif','assets/gif/jack/jack_dead.gif'], labels: ['待機','正面','背面','跑步','衝刺','跳躍','死亡'], tag: 'CHARACTER ART', title: 'Jack', caption: '點擊左右箭頭，觀賞傑克不同的動作動畫。' },
    right: { type: 'text', title: '人物介紹', subtitle: 'MEET THE CHARACTERS', paragraphs: ['JACK｜有些許衝動，對事物充滿好奇心的少年。', '本性善良，對家人與家園懷有責任感與愛護之情。並不是天生無所畏懼的真勇者，但他願意在面臨困難時往前衝，展現出真實而真摯的勇氣。', '平凡的小人物：他既不是騎士、也不是王子或魔法師，而只是一個生活在貧窮村莊裡的普通少年。'] }
  },
  {
    id: 'monsters', menu: '怪物介紹', chapter: 'CHAPTER 05',
    left: { type: 'gallery', pixel: true, title: '冒險途中的怪物', tag: 'MONSTER GIF', caption: '左右切換，查看怪物動畫。', images: ['assets/gif/monster/slime.gif','assets/gif/monster/bird.gif','assets/gif/monster/bird_dead.gif'], labels: ['史萊姆','飛鳥','飛鳥受擊'] },
    right: { type: 'text', title: '怪物介紹', subtitle: 'MEET THE MONSTERS', paragraphs: ['除了向天空攀爬，傑克也會在途中遇見不同的生物。', '滑動左頁或點擊箭頭，可以看看史萊姆與飛鳥的動作。'] }
  },
  {
    id: 'world', menu: '關卡場景', chapter: 'CHAPTER 06',
    left: { type: 'gallery', images: ['assets/5-1.png','assets/5-2.png'], tag: 'WORLD ART', title: '從村莊到雲端', caption: '魔豆藤蔓的過場插畫。' },
    right: { type: 'text', title: '關卡場景', subtitle: 'EXPLORE THE WORLD', paragraphs: ['一開始只是一場夢，醒來還是在乾枯村莊。', '向上巨型藤蔓，通往的未知高空。', '為何雲端上有巨人城堡，藏在雲層之上的神秘世界又是什麼？'] }
  },
  {
    id: 'development', menu: '製作過程', chapter: 'CHAPTER 07',
    left: { type: 'gallery', images: ['assets/6-1.png','assets/6-2.png'], tag: 'BEHIND THE SCENES', title: '製作的足跡', caption: '左右切換製作過程圖片。' },
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
