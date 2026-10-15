async (page) => {
  const origin = new URL('.', page.url()).href;
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const enterReveal = async () => {
    await page.goto(origin);
    await page.getByRole('button', { name: 'Thổi nến nào ♡', exact: true }).click();
    await page.getByRole('button', { name: 'Mở món quà ♡', exact: true }).waitFor();
  };
  let attempts = 0;
  await page.route('**/images/photo-10.webp*', route => {
    attempts++;
    return attempts === 1 ? route.abort('failed') : route.continue();
  });
  await enterReveal();
  try {
    await page.waitForFunction(() => {
      const photo = document.querySelector('.reveal-photo img');
      return photo?.complete && photo.naturalWidth > 0;
    }, null, { timeout: 3000 });
  } catch { throw new Error('The reveal photo must recover from a failed initial request'); }
  assert(attempts >= 2 && attempts <= 3, 'Photo recovery must be bounded');
  await page.unroute('**/images/photo-10.webp*');
  attempts = 0;
  await page.route('**/images/photo-10.webp*', route => { attempts++; return route.abort('failed'); });
  await enterReveal();
  await page.waitForTimeout(600);
  assert(attempts === 3, `Persistent failure needs exactly two retries, got ${attempts} requests`);
  await page.waitForTimeout(400);
  assert(attempts === 3, 'Photo retries must not continue forever');
  await page.unroute('**/images/photo-10.webp*');
  await page.goto(origin);
  return 'PASS: actual photo decode after a failed request; persistent failures stop after two retries';
}
