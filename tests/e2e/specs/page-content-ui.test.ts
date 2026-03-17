describe('Content UI Injection', () => {
  it('should locate the injected content UI div', async () => {
    await browser.url('https://github.com/JiLiZART/glab-linker-crx/blob/main/EXAMPLES.md');

    const contentDiv = await $('#crx-gitlab-linker-root').getElement();
    await expect(contentDiv).toBeDisplayed();
  });
});
