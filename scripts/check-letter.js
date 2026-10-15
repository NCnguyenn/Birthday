async (page) => {
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const origin = new URL('.', page.url()).href;
  const enter = async () => {
    await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).click();
    await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).click();
  };
  const paper = page.getByRole('article', { name: 'Nội dung lá thư gửi Chị 2', exact: true });
  const greeting = 'Chúc mừng sinh nhật Chị 2!';
  await page.setViewportSize({ width: 390, height: 1200 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(origin);
  await enter();
  await page.getByRole('navigation').getByRole('link', { name: 'Lá thư', exact: true }).waitFor({ timeout: 1500 });
  check(await paper.count() === 0, 'The closed envelope must not expose its letter to assistive technology');
  const open = page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true });
  await open.scrollIntoViewIfNeeded();
  await page.keyboard.press('Tab');
  await open.focus();
  await page.locator('.letter-scene').evaluate(node => scrollTo({ top: scrollY + node.getBoundingClientRect().top - 160, behavior: 'instant' }));
  const foldedPosition = await page.locator('.letter-paper').evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m42);
  const extractionTrace = page.evaluate(() => new Promise(resolve => {
    const scene = document.querySelector('.letter-scene');
    const sheet = document.querySelector('.letter-paper');
    const front = document.querySelector('.envelope-front');
    const started = performance.now();
    let emergedBehindPocket = false;
    let slidUp = false;
    let previousDistance = null;
    const occlusionSamples = [];
    const sample = () => {
      const paperBox = sheet.getBoundingClientRect();
      const pocketBox = front.getBoundingClientRect();
      const distance = paperBox.top - pocketBox.top;
      if (previousDistance !== null && distance < previousDistance - 2) slidUp = true;
      previousDistance = distance;
      if (paperBox.top < pocketBox.top - 15 && paperBox.bottom > pocketBox.top + 30) {
        const x = pocketBox.left + pocketBox.width * .12;
        const y = pocketBox.top + pocketBox.height * .75;
        const top = document.elementsFromPoint(x, y).find(node => node === sheet || node === front || front.contains(node));
        if (occlusionSamples.length < 5) occlusionSamples.push({ paperTop: paperBox.top, pocketTop: pocketBox.top, y, hit: top?.tagName, view: innerHeight });
        if (top && (top === front || front.contains(top))) emergedBehindPocket = true;
      }
      if (scene.classList.contains('is-readable') || performance.now() - started > 3500) resolve({ emergedBehindPocket, slidUp, occlusionSamples });
      else requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }));
  check(await open.evaluate(node => parseFloat(getComputedStyle(node).outlineOffset) < 0), 'The envelope keyboard focus outline must stay inside its clipped scene');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check(await paper.count() === 0, 'The letter must wait for its flap and paper extraction');
  check(await page.locator('.envelope-flap').evaluate(node => {
    const matrix = new DOMMatrix(getComputedStyle(node).transform);
    return matrix.m22 < .99 && matrix.m22 > -.99;
  }), 'Opening must rotate the real envelope flap');
  await paper.waitFor({ timeout: 3000 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  check(await paper.evaluate(node => node === document.activeElement), 'Keyboard opening must focus the readable paper');
  check(await paper.getByRole('heading', { name: greeting, exact: true }).count() === 1, 'The sheet must contain the birthday wish for Chị 2');
  check(await paper.evaluate(node => node.closest('.letter-scene') !== null), 'The letter must stay inside the envelope scene');
  check(await page.locator('.envelope-flap').evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m22 < -.999), 'The flap must finish fully opened');
  check(foldedPosition > 250 && await paper.evaluate(node => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42) < 1), 'The paper must physically slide out of the envelope');
  const extraction = await extractionTrace;
  check(extraction.emergedBehindPocket && extraction.slidUp, `The paper must visibly emerge upward from behind the pocket (${JSON.stringify(extraction)})`);
  check(await paper.evaluate(node => {
    const sheet = node.getBoundingClientRect();
    const pocket = document.querySelector('.envelope-front').getBoundingClientRect();
    return sheet.bottom - pocket.top >= 0 && sheet.bottom - pocket.top <= 32;
  }), 'The extracted sheet must sit above the envelope mouth with only its lower edge tucked inside');

  for (const viewport of [{ width: 320, height: 620 }, { width: 375, height: 667 }, { width: 390, height: 620 }, { width: 430, height: 932 }, { width: 620, height: 900 }, { width: 568, height: 320 }, { width: 844, height: 390 }, { width: 1440, height: 900 }]) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize(viewport);
    await page.goto(origin);
    await enter();
    await page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true }).click();
    await paper.waitFor({ timeout: 700 });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    check(await paper.getByRole('heading', { name: greeting, exact: true }).evaluate(node => {
      const bounds = node.getBoundingClientRect();
      return bounds.top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1 && bounds.bottom <= innerHeight;
    }), `The birthday greeting must be readable below the header at ${viewport.width}px`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Letter overflow at ${viewport.width}px`);
    await paper.focus();
    for (let step = 0; step < 6; step++) {
      if (await paper.evaluate(node => node.scrollTop + node.clientHeight >= node.scrollHeight - 2)) break;
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(300);
    }
    check(await paper.evaluate(node => node.scrollTop + node.clientHeight >= node.scrollHeight - 2), `Keyboard scrolling must reach the entire letter at ${viewport.width}px`);
    check(await paper.getByText('Em của chị ♡', { exact: true }).evaluate(node => {
      const bounds = node.getBoundingClientRect();
      const sheet = node.closest('.letter-paper').getBoundingClientRect();
      return bounds.top >= sheet.top && bounds.bottom <= sheet.bottom;
    }), `The complete letter must remain reachable at ${viewport.width}px`);
  }

  if (page.context().browser().browserType().name() === 'chromium') {
    await page.setViewportSize({ width: 390, height: 620 });
    await page.goto(origin);
    await enter();
    await page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true }).click();
    await paper.waitFor();
    const bounds = await paper.boundingBox();
    const x = bounds.x + bounds.width / 2;
    const y = Math.min(bounds.y + bounds.height - 60, 540);
    const touch = await page.context().newCDPSession(page);
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 8; step++) {
      await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 22 }] });
      await page.waitForTimeout(20);
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForFunction(() => document.querySelector('.letter-paper').scrollTop > 60);
    await touch.detach();
  }

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(origin);
  await enter();
  await page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true }).click();
  const readerLink = page.getByRole('navigation').getByRole('link', { name: 'Kỷ niệm', exact: true });
  await readerLink.click();
  await readerLink.focus();
  await paper.waitFor();
  check(await readerLink.evaluate(node => node === document.activeElement), 'Finishing the letter must not steal focus from a reader who moved away');

  await page.goto(origin);
  await enter();
  await page.getByRole('button', { name: 'Mở lá thư gửi Chị 2', exact: true }).click();
  await page.waitForTimeout(200);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await paper.waitFor({ timeout: 500 });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  check(await page.locator('.envelope-flap').evaluate(node => new DOMMatrix(getComputedStyle(node).transform).m22 < -.999), 'Live reduced motion must finish the hinge immediately');
  check(await paper.evaluate(node => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42) < 1), 'Live reduced motion must finish paper extraction immediately');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  check(await paper.evaluate(node => node === document.activeElement), 'Restoring motion must preserve letter focus');
  return 'PASS: real hinge/extraction, birthday for Chị 2, paper inside envelope, responsive reading, complete text, focus ownership and live reduced motion.';
}
