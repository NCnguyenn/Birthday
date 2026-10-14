async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const origin = page.url().split('/').slice(0, 3).join('/');
  const enter = async () => {
    await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).click();
    await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).click();
  };
  const message = 'Nào Hai về quê, em đãi Hai ănnnn';
  await page.setViewportSize({ width: 620, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(origin);
  await enter();
  const firstOpen = page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true });
  await firstOpen.scrollIntoViewIfNeeded();
  const revealTrace = page.evaluate(() => new Promise(resolve => {
    const scene = document.querySelector('.gift-scene');
    const started = performance.now();
    let handsAt = null;
    let quoteAt = null;
    let prematureQuote = false;
    let minHeight = Infinity;
    let maxHeight = 0;
    const sample = () => {
      const elapsed = performance.now() - started;
      const handsOpacity = Number(getComputedStyle(document.querySelector('.gift-hands')).opacity);
      const quote = document.querySelector('.gift-note-text');
      if (handsOpacity > .1 && handsAt === null) handsAt = elapsed;
      if (quote && handsOpacity < .99) prematureQuote = true;
      if (quote && Number(getComputedStyle(quote).opacity) > .1 && quoteAt === null) quoteAt = elapsed;
      const height = scene.getBoundingClientRect().height;
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
      if (quote && Number(getComputedStyle(quote).opacity) > .99 || elapsed > 4500) resolve({ handsAt, quoteAt, prematureQuote, heightChange: maxHeight - minHeight });
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }));
  await firstOpen.click();
  const hands = page.getByRole('img', { name: 'Hai bàn tay tạo hình trái tim', exact: true });
  await hands.waitFor({ timeout: 4500 });
  check(await hands.evaluate(node => node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0), 'The gift must reveal a loaded two-hand heart photograph');
  await page.getByText(message, { exact: true }).waitFor();
  const trace = await revealTrace;
  check(trace.handsAt !== null && trace.quoteAt !== null && trace.quoteAt - trace.handsAt > 250 && !trace.prematureQuote, `The hands must visibly appear before the quote (${JSON.stringify(trace)})`);
  check(trace.heightChange < 1, 'Opening the gift must not shift the scene height');
  const scene = page.getByRole('region', { name: 'Món quà dành cho Hai', exact: true });
  check(await scene.evaluate(node => node.contains(document.querySelector('.gift-note')) && node.contains(document.querySelector('.gift-hands'))), 'Hands and message must appear in the same gift scene');
  check(await page.locator('#letter').count() === 1, 'The restored letter must coexist with the hand-heart gift');
  check(await page.locator('.hero-photo img, .photo-image img').evaluateAll(images => new Set(images.map(image => image.getAttribute('src'))).size) === 12, 'Restoring the letter must preserve all twelve original photos');

  // Hold the artwork request to prove the quote cannot outrun its photograph.
  let releaseArtwork;
  let artworkGate = new Promise(resolve => { releaseArtwork = resolve; });
  await page.route('**/art/heart-hands.webp', async route => { await artworkGate; await route.continue(); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(origin);
  await enter();
  const open = page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true });
  await open.focus();
  await page.keyboard.press('Enter');
  check(await page.getByText(message, { exact: true }).count() === 0, 'The gift message must wait while the heart artwork loads');
  await page.waitForTimeout(250);
  check(await page.getByText(message, { exact: true }).count() === 0, 'Reduced motion must still wait for the photograph');
  releaseArtwork();
  await page.getByText(message, { exact: true }).waitFor({ timeout: 2500 });
  check(await page.locator('.gift-note').evaluate(node => node === document.activeElement), 'Keyboard activation must focus the final gift message');
  artworkGate = new Promise(resolve => { releaseArtwork = resolve; });
  await page.goto(origin);
  await enter();
  await page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true }).click();
  const readerLink = page.getByRole('navigation').getByRole('link', { name: 'Kỷ niệm', exact: true });
  await readerLink.click();
  await readerLink.focus();
  releaseArtwork();
  await page.getByText(message, { exact: true }).waitFor();
  check(await readerLink.evaluate(link => link === document.activeElement), 'A delayed gift reveal must not steal focus after the reader moves elsewhere');
  await page.unroute('**/art/heart-hands.webp');

  await page.route('**/art/heart-hands.webp', route => route.abort());
  await page.goto(origin);
  await enter();
  await page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true }).click();
  await page.getByText(message, { exact: true }).waitFor({ timeout: 1000 });
  check(await page.getByRole('img', { name: 'Hai bàn tay tạo hình trái tim', exact: true }).textContent() === '🫶', 'Failed artwork must keep a visible two-hand heart fallback');
  await page.unroute('**/art/heart-hands.webp');
  for (const phase of ['lid', 'hands', 'note']) {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(origin);
    await enter();
    await page.locator('.gift-hands img').evaluate(image => image.decode());
    await page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true }).click();
    if (phase === 'lid') await page.waitForTimeout(200);
    else await page.waitForFunction(selector => {
      const node = document.querySelector(selector);
      return node && Number(getComputedStyle(node).opacity) > .1 && Number(getComputedStyle(node).opacity) < .9;
    }, phase === 'hands' ? '.gift-hands' : '.gift-note-text');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByText(message, { exact: true }).waitFor({ timeout: 500 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(await page.locator('.gift-hands').evaluate(node => Number(getComputedStyle(node).opacity) > .999 && Math.abs(new DOMMatrix(getComputedStyle(node).transform).a - 1) < .001), `Live reduced motion must finish the gift artwork during ${phase}`);
    check(await page.locator('.gift-note-text').evaluate(node => Number(getComputedStyle(node).opacity) > .999), `Live reduced motion must finish the gift text during ${phase}`);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(await page.locator('.gift-note-text').evaluate(node => Number(getComputedStyle(node).opacity) > .999), 'Restoring normal motion must keep an already revealed message visible');
    check(await page.locator('.gift-note').evaluate(node => node === document.activeElement), 'Changing motion preferences must preserve focus on the message');
  }
  return 'PASS: same-place hands then quote, restored letter, twelve photos, slow/failed artwork, focus ownership and live reduced motion.';
}
