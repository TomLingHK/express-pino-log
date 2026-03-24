
describe('Generated Test from Logs', () => {
  it('should follow the recorded log sequence', () => {
    cy.visit('/'); // 預設訪問根路徑，可根據需求修改
    cy.location('pathname').should('eq', '/login');
    cy.get('[data-cy="loginButton"]').click();
    cy.get('[data-cy="usernameInput"]').type("tester1");
    cy.location('pathname').should('eq', '/home');
    cy.intercept('POST', '/getLLMChatSession', {
      statusCode: 200,
      body: {
        "code": "Success",
        "message": "Success",
        "data": {
          "sessions": [
            {
              "id": 212,
              "last_modified_date": "2026-03-16T15:51:50+08:00",
              "tag": [
                "administrative_QnA",
                "中文"
              ],
              "created_date": "2026-03-16T08:10:43+08:00",
              "name": "新聊天174"
            },
            {
              "id": 211,
              "last_modified_date": "2026-03-13T17:15:12+08:00",
              "tag": [
                "speech",
                "English"
              ],
              "created_date": "2026-03-13T15:18:01+08:00",
              "name": "c59_test"
            }
          ],
          "count": 174
        }
      }
    }).as('getLLMChatSession');
  });
});
