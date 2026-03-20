const fs = require('fs');

// 解析命令列參數
const args = process.argv.slice(2);
const inputFile = args[0] || 'custom_log.txt'; // 預設值
const outputFile = args[1] || 'generated_test.cy.js'; // 預設值

function translateLogs() {
  try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n');
    
    let cypressCommands = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      // 處理 [Render Log] - 轉換為路徑斷言
      if (line.includes('[Render Log]')) {
        const routeMatch = line.match(/\(([^)]+)\)/); // 抓取括號內容
        if (routeMatch) {
          cypressCommands.push(`    cy.location('pathname').should('eq', '${routeMatch[1]}');`);
        }
      }

      // 處理 [Button Log] - 轉換為按鈕點擊 (使用 data-cy)
      if (line.includes('[Button Log]')) {
        const buttonMatch = line.match(/Button click: (\w+)/); // 抓取 'Button click: ' 後的單字
        if (buttonMatch) {
          cypressCommands.push(`    cy.get('[data-cy="${buttonMatch[1]}"]').click();`);
        }
      }
    });

    // 封裝成 Cypress 的測試結構
    const testTemplate = `
describe('Generated Test from Logs', () => {
  it('should follow the recorded log sequence', () => {
    cy.visit('/'); // 預設訪問根路徑，可根據需求修改
${cypressCommands.join('\n')}
  });
});
    `;

    fs.writeFileSync(outputFile, testTemplate);
    console.log(`✅ 轉換成功！請查看 ${outputFile}`);
  } catch (err) {
    console.error('❌ 讀取或寫入檔案時出錯:', err);
  }
}

translateLogs();
