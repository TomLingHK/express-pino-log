const fs = require('fs');

// 解析命令列參數
const args = process.argv.slice(2);
const inputFile = args[0] || 'custom_log.txt'; // 預設值
const outputFile = args[1] || 'generated_test.cy.jsx'; // 預設值

function translateLogs() {
  try {
    const data = fs.readFileSync(inputFile, 'utf8');
    const lines = data.split('\n');
    
    let cypressCommands = [];

    lines.forEach(line => {
      if (!line.trim()) return;

      // 處理 [Component Log] - 使用 cy.mount 模擬 component
      if (line.includes('[Component Log]')) {
        const componentMatch = line.match(/Component name: (\w+) Props: (.+)/);
        if (componentMatch) {
          const componentName = componentMatch[1];
          let props = componentMatch[2];

          try {
            // Unescape backslashes in the data string
            props = props.replace(/\\/g, '');
            const parsedData = JSON.parse(props);

            cypressCommands.push(`    cy.mount(`)
            cypressCommands.push(`    <${componentName}`)
            for (const property in parsedData) {
                cypressCommands.push(`      ${property}={${parsedData[property]}}`)   
            }
            cypressCommands.push(`    />)`)
          } catch (err) {
            cypressCommands.push(`    // Failed to parse Component Log data`);
            cypressCommands.push(`    console.error('Error parsing Component Log data:', err);`);
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
