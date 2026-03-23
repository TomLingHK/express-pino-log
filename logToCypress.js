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

      // 處理 [Input Log] - 轉換為文字輸入 (使用 data-cy)
      if (line.includes('[Input Log]')) {
        const inputMatch = line.match(/Input: (\w+)/); // 抓取 'Input: ' 後的單字
        const valueMatch = line.match(/Value: (\w+)/); // 抓取 'Value: ' 後的單字
        if (inputMatch && valueMatch) {
          cypressCommands.push(`    cy.get('[data-cy="${inputMatch[1]}"]').type("${valueMatch[1]}");`);
        }
      }

      // 處理 [API Log] - 使用 cy.intercept 模擬 API 請求
      if (line.includes('[API Log]')) {
        const apiMatch = line.match(/API_name: (\w+) Method: (\w+) Data: (.+)/);
        if (apiMatch) {
          const apiName = apiMatch[1];
          const method = apiMatch[2];
          let data = apiMatch[3];

          try {
            // Unescape backslashes in the data string
            data = data.replace(/\\/g, '');
            const parsedData = JSON.parse(data);

            cypressCommands.push(`    cy.intercept('${method}', '/${apiName}', {`);
            cypressCommands.push(`      statusCode: 200,`);
            cypressCommands.push(`      body: ${JSON.stringify(parsedData, null, 2)}`);
            cypressCommands.push(`    }).as('${apiName}');`);
          } catch (err) {
            cypressCommands.push(`    // Failed to parse API Log data`);
            cypressCommands.push(`    console.error('Error parsing API Log data:', err);`);
            console.log("Error: ", err)
          }
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
