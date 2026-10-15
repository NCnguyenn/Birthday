async (page) => {
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(page.url().split('/').slice(0, 3).join('/'));
  await page.reload();
  await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).click();
  await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).click();
  await page.getByRole('heading', { level: 1 }).waitFor();
  check(await page.locator('.hero-photos img').count() === 1, 'The opening spread needs one large photograph');

  const nav = page.getByRole('navigation', { name: 'Các phần của món quà' });
  await nav.waitFor({ state: 'visible' });
  check(await nav.count() === 1, 'The gift needs labelled section navigation');
  check(await nav.getByRole('link').evaluateAll(links => links.every(link => {
    const bounds = link.getBoundingClientRect();
    return bounds.width >= 44 && bounds.height >= 44;
  })), 'Navigation touch targets must be at least 44px');
  for (const name of ['Lá thư', 'Kỷ niệm', 'Lời chúc', 'Món quà']) {
    const link = nav.getByRole('link', { name, exact: true });
    const target = await link.getAttribute('href');
    check(target?.startsWith('#') && await page.locator(target).count() === 1, `Broken section link: ${name}`);
  }
  check(await page.locator('#letter').count() === 1, 'The birthday letter for Chị 2 must be restored');
  for (const image of await page.locator('.hero-photo img, .photo-image img').all()) {
    await image.scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() => [...document.querySelectorAll('.hero-photo img, .photo-image img')].every(image => image.complete && image.naturalWidth > 0));
  check(await page.locator('.hero-photo img, .photo-image img').evaluateAll(images => new Set(images.map(image => image.getAttribute('src'))).size) === 12, 'The page must retain twelve original photographs');

  const liveWish = page.getByRole('button', { name: 'Mở thiệp: Luôn khỏe mạnh', exact: true });
  await liveWish.scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await liveWish.click();
  const reducedFlipFrames = await page.evaluate(() => new Promise(resolve => {
    const frames = [];
    const sample = () => {
      frames.push(new DOMMatrix(getComputedStyle(document.querySelector('.wish-grid .flip-inner')).transform).a);
      if (frames.length < 6) requestAnimationFrame(sample);
      else resolve(frames);
    };
    requestAnimationFrame(sample);
  }));
  check(reducedFlipFrames.at(-1) < -0.999 && reducedFlipFrames.every(a => Math.abs(a) > 0.999), `A mounted wish card must snap to its back without intermediate rotation when the reduced-motion preference changes (${reducedFlipFrames.join(', ')})`);
  await page.getByRole('button', { name: 'Đóng thiệp: Luôn khỏe mạnh', exact: true }).click();

  const focusAnchor = nav.getByRole('link').first();
  await focusAnchor.focus();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  check(await focusAnchor.evaluate(link => link === document.activeElement), 'Changing motion preferences must not steal focus from the reader');

  await page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true }).click();
  const letter = page.getByRole('article', { name: 'Nội dung lá thư gửi Chị 2', exact: true });
  await letter.waitFor();
  check(await letter.getByRole('heading', { name: 'Chúc mừng sinh nhật Chị 2!', exact: true }).count() === 1, 'The opened letter must contain the birthday greeting');

  const photo = page.getByRole('button', { name: /^Xem ảnh:/ }).first();
  await photo.click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  check(await dialog.evaluate(el => el.tagName === 'DIALOG' && el.open), 'Gallery must use a modal dialog');
  await page.getByRole('button', { name: 'Ảnh sau', exact: true }).click();
  check((await dialog.getAttribute('aria-label')).startsWith('Ảnh 2 '), 'Gallery next did not work');
  await page.keyboard.press('Tab');
  check(await dialog.evaluate(el => el.matches(':modal')), 'Gallery lost its modal state');
  await page.keyboard.press('Tab');
  check(await dialog.evaluate(el => el.contains(document.activeElement)), 'Dialog focus escaped');
  await page.keyboard.press('Escape');
  check(await page.getByRole('dialog').count() === 0, 'Escape did not close gallery');
  check(await photo.evaluate(el => el === document.activeElement), 'Gallery did not restore focus');

  const wish = page.getByRole('button', { name: 'Mở thiệp: Luôn khỏe mạnh', exact: true });
  await wish.click();
  check(await page.getByRole('button', { name: 'Đóng thiệp: Luôn khỏe mạnh', exact: true }).getAttribute('aria-pressed') === 'true', 'Wish did not open');
  await page.getByRole('button', { name: 'Đóng thiệp: Luôn khỏe mạnh', exact: true }).click();
  await page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true }).click();
  await page.getByText('Nào Hai về quê, em đãi Hai ănnnn', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Gửi một cái ôm ♡', exact: true }).click();
  const hugScale = await page.evaluate(() => new Promise(resolve => {
    const heart = document.querySelector('[data-hug-heart]');
    const started = performance.now();
    let maximum = 0;
    const sample = () => {
      maximum = Math.max(maximum, new DOMMatrix(getComputedStyle(heart).transform).a);
      if (performance.now() - started < 1300) requestAnimationFrame(sample);
      else resolve(maximum);
    };
    requestAnimationFrame(sample);
  }));
  check(hugScale <= 1.001, `The hug heart must settle without spring overshoot (scale ${hugScale})`);
  await page.getByText('Gửi Chị 2 một cái ôm. Nào về quê gặp nhau nhé!', { exact: true }).waitFor();

  for (const width of [320, 360, 375, 390, 430, 640, 768, 900, 960, 1100, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
    check(await nav.evaluate(el => el.getBoundingClientRect().width <= innerWidth), `Navigation overflow at ${width}px`);
    check(await page.locator('.wish-back').evaluateAll(cards => cards.every(card => card.scrollHeight <= card.clientHeight)), `Wish text is clipped at ${width}px`);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  check(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto'), 'Reduced motion still scrolls smoothly');
  await page.getByRole('button', { name: 'Xem lại khoảnh khắc sinh nhật', exact: true }).click();
  await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).waitFor();
  await page.waitForFunction(() => !document.querySelector('canvas'));
  const reducedStarted = await page.evaluate(() => performance.now());
  await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).click();
  await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).waitFor();
  check(await page.evaluate(() => performance.now()) - reducedStarted < 800, 'Reduced motion must skip the candle animation delay');
  check(await page.locator('canvas').count() === 0, 'Reduced motion must not start a confetti canvas');
  await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).click();
  await page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true }).click();
  await page.getByRole('article', { name: 'Nội dung lá thư gửi Chị 2', exact: true }).waitFor({ timeout: 700 });
  await page.getByRole('button', { name: 'Mở món quà bí mật 🎁', exact: true }).click();
  await page.getByText('Nào Hai về quê, em đãi Hai ănnnn', { exact: true }).waitFor();
  check(await page.locator('canvas').count() === 0, 'Reduced motion must also disable gift confetti');
  const restoredWish = page.getByRole('button', { name: 'Mở thiệp: Luôn khỏe mạnh', exact: true });
  await restoredWish.scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await restoredWish.click();
  await page.waitForTimeout(60);
  check(await page.locator('.wish-grid .flip-inner').first().evaluate(card => new DOMMatrix(getComputedStyle(card).transform).a) > -0.999, 'Animations must resume when reduced motion is turned off on the same mounted card');
  await page.waitForFunction(() => new DOMMatrix(getComputedStyle(document.querySelector('.wish-grid .flip-inner')).transform).a < -0.999);
  await page.getByRole('button', { name: 'Xem lại khoảnh khắc sinh nhật', exact: true }).click();
  await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).waitFor();
  check(errors.length === 0, `Browser errors: ${errors.join('; ')}`);
  return 'PASS: candle, navigation, birthday letter, twelve photos, gallery/focus, wishes, gift, hug without overshoot, replay, responsive widths and reduced motion';
}
