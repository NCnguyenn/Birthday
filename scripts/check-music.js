// Run against the current local page: playwright-cli -s=birthday-music run-code --filename=scripts/check-music.js
async (page) => {
  const origin = new URL('.', page.url()).href;
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
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
    assert((await state()).attempts.length > 0, 'Music must attempt autoplay by default');
    assert(await control.getAttribute('aria-pressed') === 'false', 'Blocked autoplay must show the real paused state');
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
  const asset = await page.request.get(new URL('audio/happy-birthday.mp3', origin).href);
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
  const touchAttempts = (await state()).attempts.length;
  await page.touchscreen.tap(80, 110);
  await playing();
  assert((await state()).attempts.length === touchAttempts + 1, 'The first page touch must unlock music once');

  await startup();
  const pageKeyAttempts = (await state()).attempts.length;
  await page.keyboard.press('Enter');
  await playing();
  assert((await state()).attempts.length === pageKeyAttempts + 1, 'Keyboard activation must unlock default music once');

  await startup();
  const keyboardAttempts = (await state()).attempts.length;
  await control.focus();
  await page.keyboard.press('Space');
  await playing();
  assert((await state()).attempts.length === keyboardAttempts + 1, 'The focused control must also play once on keyboard activation');

  await startup();
  // A fresh invalid resource avoids WebKit's cache and media-request routing differences.
  await page.evaluate(() => {
    const audio = window.__musicTest.elements.at(-1);
    audio.src = 'data:audio/mpeg;base64,dW5hdmFpbGFibGUgYXVkaW8=';
    audio.load();
  });
  await page.waitForFunction(() => document.querySelector('[aria-label*="Happy Birthday"]')?.textContent.includes('Nhạc chưa sẵn sàng'));
  assert(await control.getAttribute('aria-pressed') === 'false', 'Unavailable media must stay paused with a readable status');

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
    await page.goto(new URL('__music_check__', origin).href);
    await page.waitForFunction(() => typeof window.__unmountMusic === 'function');
    await control.waitFor();
    await page.bringToFront();
    const blocked = await state();
    assert(blocked.attempts.length > 0 && blocked.audios.every(audio => audio.paused), 'The teardown harness must begin with autoplay blocked');
    await page.evaluate(() => window.__unmountMusic());
    await page.touchscreen.tap(80, 110);
    await page.keyboard.press('Enter');
    assert((await state()).attempts.length === blocked.attempts.length, 'Unmount before playback must remove every pending gesture listener');
    await page.goto(new URL('__music_check__', origin).href);
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
    teardown = 'passed before and after playback';
    await page.unroute('**/__music_check__');
  }
  assert(errors.length === 0, `Music lifecycle must not throw browser errors: ${errors.join('; ')}`);
  await page.goto(origin);
  return { autoplayAttempt: 'passed', firstControlTap: 'passed', explicitPause: 'passed', firstPageTouch: 'passed', firstPageKey: 'passed', controlKeyboard: 'passed', mediaEvents: 'passed', unavailableAudio: 'passed', teardown };
}
