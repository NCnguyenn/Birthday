async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const viewport of [{ width: 568, height: 320 }, { width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 620 }, { width: 430, height: 932 }, { width: 620, height: 900 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:4173/');
    await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).click();
    await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Món quà', exact: true }).click();
    await page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true }).focus();
    await page.keyboard.press('Enter');
    const message = page.getByText('Nào Hai về quê, em đãi Hai ănnnn', { exact: true });
    await message.waitFor();
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(await message.evaluate(node => node.closest('.gift-note') === document.activeElement), 'Keyboard opening must focus the gift message');
    check(await message.evaluate(node => {
      const bounds = node.getBoundingClientRect();
      const header = document.querySelector('.site-header').getBoundingClientRect();
      return bounds.top >= header.bottom - 1 && bounds.bottom <= innerHeight;
    }), `The gift message must be visible below the sticky header at ${viewport.width}x${viewport.height}`);
    check(await page.getByRole('img', { name: 'Hai bàn tay tạo hình trái tim', exact: true }).evaluate(node => {
      const bounds = node.getBoundingClientRect();
      const header = document.querySelector('.site-header').getBoundingClientRect();
      return bounds.top >= header.bottom - 1 && bounds.bottom <= innerHeight;
    }), `Both hands and message must remain visible in one scene at ${viewport.width}x${viewport.height}`);
  }
  return 'PASS: gift focus and visible hands/text on narrow phones, iPhone sizes, tablet and landscape.';
}
