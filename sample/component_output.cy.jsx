
describe('Generated Test from Logs', () => {
  it('should follow the recorded log sequence', () => {
    cy.visit('/'); // 預設訪問根路徑，可根據需求修改
    cy.mount(
    <NewChatPopup
      newChatCount={175}
      pageLang={en}
    />)
  });
});
    