# Climb! Jack! 互動童話書網站骨架

## 開啟網站
直接雙擊 `index.html`，用 Chrome、Edge 或 Safari 開啟即可。無需安裝套件，也不需啟動伺服器。

## 修改文字
打開 `content.js`，每一個物件就是一個雙頁跨頁：
- `id`：章節代號
- `menu`：上方快捷選單文字
- `chapter`：章節英文標示
- `left` / `right`：左右頁內容
- `type: 'image'`：圖片頁；設定 `image`、`title`、`caption`
- `type: 'text'`：文字頁；設定 `title`、`subtitle`、`paragraphs`
- `type: 'features'`：玩法特色頁；設定 `features`
- `type: 'credits'`：團隊分工頁；設定 `members`

## 更換左上角 Logo
將你的 `logo.png` 放到 `assets/logo.png`（與預設連結一致）。若圖片未放入，網站會自動顯示文字版 Logo。
若你要放在 `index.html` 同層，將 `src="assets/logo.png"` 改為 `src="logo.png"` 即可。

## 更換圖片
1. 將圖片放進 `assets/` 資料夾，例如 `assets/jack.png`。
2. 在 `content.js` 該頁設定 `image: 'assets/jack.png'`。
3. 重新整理瀏覽器。

## 更換色彩
編輯 `styles.css` 最上方 `:root` 的 CSS 色票，例如 `--paper`、`--green`、`--cover`。

## 可操作功能
- 點擊 START 播放藤蔓動畫、展開選單、出現書本封面
- 點封面打開童話書
- 點左右箭頭翻頁，鍵盤左右鍵翻頁，手機左右滑動翻頁
- 點上方章節捷徑跳頁
- 點 Logo 返回封面

## 備註
這是純 HTML/CSS/JS 的可編輯原型。現在的翻頁使用 CSS 3D 示意轉場，並非真實紙張曲面模擬；封面「倒帶」也先採用簡化版動畫。若要做成更逼真的紙張捲角與逐張倒翻，可在下一版加入專用翻頁引擎（如 StPageFlip）或使用逐頁 3D 結構。
