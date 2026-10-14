// Run against the current local page: playwright-cli -s=birthday-music run-code --filename=scripts/check-music.js
async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.unroute('**/audio/happy-birthday.mp3');
  await page.unroute('**/__music_check__');

  // Preserve native audio playback; simulate Safari's stricter gesture policy only.
  await page.addInitScript(() => {
    if (window.__musicTest) return;
    const state = window.__musicTest = { elements: [], attempts: [], event: null };
    const NativeAudio = window.Audio;
    window.Audio = function (...args) {
      const audio = new NativeAudio(...args);
      state.elements.push(audio);
      return audio;
    };
    window.Audio.prototype = NativeAudio.prototype;
    for (const type of ['pointerdown', 'click', 'touchend', 'keydown']) {
      window.addEventListener(type, (event) => { state.event = event; }, true);
    }
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const event = state.event;
      const activated = event?.isTrusted && event.eventPhase !== Event.NONE
        && ['click', 'touchend', 'keydown'].includes(event.type);
      state.attempts.push({ src: this.src, gesture: activated ? event.type : null });
      if (!activated) return Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
      return nativePlay.call(this);
    };
  });

  const control = page.getByRole('button', { name: /Happy Birthday/ });
  const state = () => page.evaluate(() => ({
    attempts: window.__musicTest.attempts,
    audios: window.__musicTest.elements.map((audio) => ({
      paused: audio.paused, src: audio.src, loop: audio.loop, volume: audio.volume,
    })),
  }));
  const startup = async () => {
    await page.goto(origin);
    await page.waitForFunction(() => window.__musicTest.elements.length > 0);
    await control.waitFor();
    await page.bringToFront();
    assert((await state()).attempts.length === 0, 'The page must stay silent until the music control is activated');
    assert(await control.getAttribute('aria-pressed') === 'false', 'The initial music control must be paused');
  };
  const playing = async () => {
    await page.waitForFunction(() => document.querySelector('[aria-label*="Happy Birthday"]')?.getAttribute('aria-pressed') === 'true');
    const current = (await state()).audios.at(-1);
    assert(!current.paused && current.loop && current.volume > 0 && current.volume < 0.5, 'Audio must actually play, loop, and stay quiet');
  };

  await startup();
  const initial = await state();
  assert(initial.audios.at(-1).src.endsWith('/audio/happy-birthday.mp3'), 'The control must use the bundled Happy Birthday recording');
  assert(initial.audios.slice(0, -1).every((audio) => audio.paused), 'StrictMode cleanup must stop the previous audio element');
  const asset = await page.request.get(`${origin}/audio/happy-birthday.mp3`);
  assert(asset.ok() && (await asset.body()).length > 10000, 'The configured music file must be available locally');

  await control.tap();
  await playing();
  assert((await state()).attempts.length === initial.attempts.length + 1, 'First control tap must play once without a global-handler double toggle');
  await control.click();
  await page.waitForFunction(() => document.querySelector('[aria-label*="Happy Birthday"]')?.getAttribute('aria-pressed') === 'false');
  assert(await control.getAttribute('aria-pressed') === 'false', 'The control must pause the music');
  const pausedAttempts = (await state()).attempts.length;
  await page.touchscreen.tap(80, 110);
  await page.keyboard.press('Enter');
  assert((await state()).attempts.length === pausedAttempts, 'Explicit pause must survive later touch and keyboard interactions');
  await control.click();
  await playing();
  await page.evaluate(() => window.__musicTest.elements.at(-1).pause());
  await page.waitForFunction(() => document.querySelector('[aria-label*="Happy Birthday"]')?.getAttribute('aria-pressed') === 'false');
  assert(await control.getAttribute('aria-pressed') === 'false', 'A native pause event must update the control');
  const nativePausedAttempts = (await state()).attempts.length;
  await page.touchscreen.tap(80, 110);
  await page.keyboard.press('Enter');
  assert((await state()).attempts.length === nativePausedAttempts, 'A native pause must also survive page gestures; only the music control may resume playback');

  await startup();
  await page.touchscreen.tap(80, 110);
  assert((await state()).attempts.length === 0, 'Touching the page must not start music');
  assert(await control.getAttribute('aria-pressed') === 'false', 'Page touch must keep music paused');

  await startup();
  await page.keyboard.press('Enter');
  assert((await state()).attempts.length === 0, 'Typing outside the control must not start music');
  assert(await control.getAttribute('aria-pressed') === 'false', 'An unrelated key must keep music paused');

  await startup();
  const keyboardAttempts = (await state()).attempts.length;
  await control.focus();
  await page.keyboard.press('Space');
  await playing();
  assert((await state()).attempts.length === keyboardAttempts + 1, 'The focused control must also play once on keyboard activation');

  await page.route('**/audio/happy-birthday.mp3', (route) => route.fulfill({
    status: 200, contentType: 'audio/mpeg', body: 'unavailable audio',
  }));
  await startup();
  await page.waitForFunction(() => document.querySelector('[aria-label*="Happy Birthday"]')?.textContent.includes('Nhạc chưa sẵn sàng'));
  assert(await control.getAttribute('aria-pressed') === 'false', 'Unavailable media must stay paused with a readable status');
  await page.unroute('**/audio/happy-birthday.mp3');

  // Dev-only harness mounts the actual component to verify React teardown without a production test hook.
  const html = await (await page.request.get(origin)).text();
  let teardown = 'covered in dev only';
  if (html.includes('/src/main.tsx')) {
    await page.route('**/__music_check__', (route) => route.fulfill({
      contentType: 'text/html',
      body: html.replace(/<script[^>]+src="\/src\/main\.tsx[^"]*"[^>]*><\/script>/, `<script type="module">
        import React from '/node_modules/.vite/deps/react.js';
        import ReactDOM from '/node_modules/.vite/deps/react-dom_client.js';
        import MusicToggle from '/src/components/MusicToggle.tsx';
        import '/src/index.css';
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(React.StrictMode, null, React.createElement(MusicToggle)));
        window.__unmountMusic = () => root.unmount();
      </script>`),
    }));
    await page.goto(`${origin}/__music_check__`);
    await page.waitForFunction(() => typeof window.__unmountMusic === 'function');
    await control.waitFor();
    await page.bringToFront();
    await control.click();
    await playing();
    await page.evaluate(() => window.__unmountMusic());
    const stopped = await state();
    assert(stopped.audios.every((audio) => audio.paused), 'Unmount must stop every audio element');
    await page.touchscreen.tap(80, 110);
    await page.keyboard.press('Enter');
    assert((await state()).attempts.length === stopped.attempts.length, 'Unmount must remove gesture listeners');
    teardown = 'passed';
    await page.unroute('**/__music_check__');
  }
  assert(errors.length === 0, `Music lifecycle must not throw browser errors: ${errors.join('; ')}`);
  await page.goto(origin);
  return { silentStartup: 'passed', firstControlTap: 'passed', explicitPause: 'passed', quietPageTouch: 'passed', quietPageKey: 'passed', controlKeyboard: 'passed', mediaEvents: 'passed', unavailableAudio: 'passed', teardown };
}
