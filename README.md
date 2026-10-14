# A Little Gift For My Sister ♡

Website sinh nhật cá nhân hóa dành tặng chị gái — mở link → thổi nến → lá thư gửi Chị 2 → album kỷ niệm → thiệp lời chúc → hộp quà bí mật. Thiết kế theo mockup nghệ thuật đã duyệt: nền trắng hồng, màu cherry `#A44360`, chữ mận `#502E39`, ảnh gia đình dạng vòm, nét hoa và ruy băng mềm. Bánh kem, phong thư, hộp quà và hai bàn tay tạo tim dùng artwork có chất liệu thật; bố cục và chữ là HTML/CSS co giãn trên điện thoại.

## Chạy local

```bash
npm install
npm run dev        # mở http://localhost:5173
```

## Build & preview production

```bash
npm run build       # tsc + vite build -> dist/
npm run preview     # xem bản production tại local
```

## Ảnh

- Ảnh gốc lưu cục bộ: `images/` — 12 file JPG; `.gitignore` giữ chúng ngoài repo.
- Ảnh web tối ưu (WebP, max 1200px): `public/images/photo-01..12.webp`.
- Tối ưu lại sau khi thay ảnh gốc: `npm run optimize-images` (tự ghi lại `src/data/photos.json` với kích thước).
- Component `Photo` thử tải lại tối đa hai lần khi ảnh lỗi, giữ nguyên kích thước và nội dung thay thế. Việc chặn mạng kéo dài vẫn cần xử lý ở trình duyệt hoặc môi trường phục vụ trang.
- Không commit ảnh gốc lên git công khai nếu không muốn lộ ảnh riêng tư — Vercel chỉ cần `public/images`.

## Chỉnh nội dung

**Mọi chữ, caption, ảnh, lời chúc đều nằm trong [`src/data/content.ts`](src/data/content.ts)** — sửa file đó là đủ:

- `sisterName` — tên chị (mặc định "Chị yêu")
- `intro` / `reveal` — màn hình bánh kem & chúc mừng
- `hero.photo` — ảnh Hero (mặc định: ba chị em bên hoa giấy)
- `letter` — lời chúc sinh nhật gửi Chị 2, các đoạn thư và chữ ký
- `gallery.photos` — 11 ảnh + caption; cùng ảnh hero giữ đủ 12 ảnh gốc
- `wishes.cards` — 4 tấm thiệp
- `gift.secretMessage` — câu nhắn xuất hiện sau hình hai bàn tay tạo tim
- `finale` — lời nhắn cuối
- `media.music` — đã có bản Happy Birthday không lời tại `/audio/happy-birthday.mp3`; đặt `null` để ẩn nút nhạc

Hộp quà mở nắp, chuyển sang ảnh hai bàn tay tạo tim, rồi hiện câu “Nào Hai về quê, em đãi Hai ănnnn” ngay trong cùng một khung. Ảnh được tải trước; nếu chưa tải xong, câu nhắn chờ ảnh. Nếu ảnh lỗi, 🫶 thay thế để phần quà tiếp tục hoạt động. Bật giảm chuyển động giữa hiệu ứng sẽ hoàn tất ngay; khung quà và focus người đọc vẫn ổn định.

Lá thư nằm trong khe phong thư, phía sau mặt trước của túi giấy. Bấm mở sẽ xoay nắp trước, rồi kéo giấy lên từ bên trong để hiện “Chúc mừng sinh nhật Chị 2!”. Khi đọc, chỉ mép dưới giấy còn nằm trong phong thư; giấy không được đưa lên đè toàn bộ phong thư. Trên màn hình nhỏ có thể cuộn trong tờ giấy để đọc hết lời chúc. Nội dung đóng được ẩn khỏi bàn phím/công nghệ hỗ trợ; mở xong chỉ nhận focus nếu người đọc vẫn ở phần thư. Giảm chuyển động hoàn tất hiệu ứng ngay.

Nhạc mặc định tắt theo yêu cầu hiện tại. Chạm vào trang hay dùng bàn phím sẽ giữ trang yên lặng; bấm chính nút **Happy Birthday** để nghe, bấm lại để tạm dừng. Khi bật, bản nhạc lặp lại ở âm lượng nhẹ. File nhạc nằm trong `public/audio/happy-birthday.mp3`, không cần dịch vụ nhạc bên ngoài.

Tạo lại bản nhạc (cần Python và ffmpeg): `python scripts/generate-birthday-music.py`. Kiểm tra vòng đời nhạc với Chrome có cảm ứng và Vite đang chạy:

```bash
playwright-cli -s=birthday-music open http://127.0.0.1:5173 --browser=chrome --mobile
playwright-cli -s=birthday-music run-code --filename=scripts/check-music.js
```

Bài kiểm tra dùng âm thanh thật với chính sách cử chỉ nghiêm ngặt: kiểm tra trạng thái yên lặng ban đầu, chạm/phím ngoài nút, bật bằng nút cảm ứng hoặc Space, tạm dừng, sự kiện âm thanh, file lỗi và dọn dẹp component. Phần dọn dẹp React chạy trên Vite dev; các kiểm tra còn lại cũng dùng được với URL preview production.

Kiểm tra toàn bộ hành trình sinh nhật trên phiên trình duyệt đang mở trang local:

```bash
playwright-cli -s=birthday open http://127.0.0.1:5173 --browser=chrome --mobile
playwright-cli -s=birthday --raw run-code --filename=scripts/check-site.js
```

Bài kiểm tra bao gồm bánh kem, điều hướng, lá thư, đủ 12 ảnh đã giải mã, focus bàn phím, thiệp, quà, cái ôm không nảy vượt điểm dừng, xem lại và bố cục 320–1440px. Tùy chọn giảm chuyển động được kiểm tra cả khi bật/tắt trong lúc trang đang mở. Có thể thay URL dev bằng URL production preview.

Kiểm tra ảnh phục hồi sau một yêu cầu lỗi và dừng sau đúng hai lần thử lại khi lỗi kéo dài:

```bash
playwright-cli -s=birthday --raw run-code --filename=scripts/check-photos.js
```

Kiểm tra mở quà bằng bàn phím trên màn hình 390×620 và 620×900, bảo đảm hình tay/câu nhắn cùng hiển thị dưới thanh điều hướng:

```bash
playwright-cli -s=birthday --raw run-code --filename=scripts/check-reading-focus.js
```

Kiểm tra trình tự hình tay trước câu nhắn, kích thước khung quà ổn định, ảnh tải chậm/lỗi, không kéo focus về quà khi người đọc đã chuyển mục, và bật/tắt giảm chuyển động giữa lúc mở nắp, hiện tay hoặc hiện chữ:

```bash
playwright-cli -s=birthday --raw run-code --filename=scripts/check-gift-reveal.js
```

Mockup đã duyệt: `mockups/birthday-website-artistic-v2.png`. Các ảnh chụp website sau chỉnh sửa nằm trong `mockups/rendered-refinements/`. Artwork sinh bằng ImageGen được lưu cục bộ ở `public/art/`, bản gốc và prompt ở `mockups/art-source/`. Ảnh mới `heart-hands.webp` có alpha, 900×587px, 58.7KB; prompt chính xác nằm trong `mockups/art-source/heart-hands.prompt.txt`. Khi thay ảnh bánh hoặc quà, cần căn lại vị trí ngọn lửa và phần nắp/thân trong component tương ứng.

Kiểm tra lá thư xoay nắp, giấy đi lên từ sau lớp túi phong thư, vị trí mép giấy, đọc hết nội dung bằng bàn phím trên 320/390/620/1440px, focus và giảm chuyển động:

```bash
playwright-cli -s=birthday --raw run-code --filename=scripts/check-letter.js
```

Ảnh chụp thư thực tế ở `mockups/rendered-letter/`. Sprite phong thư `public/art/letter-envelope.webp` có alpha, 1024×1536px, 105.2KB; nắp và thân dùng hai vùng cắt của cùng ảnh. Bản gốc/prompt lưu cục bộ tại `mockups/art-source/letter-envelope.{png,prompt.txt}`. Nếu thay sprite, căn lại vùng cắt trong `Letter.tsx`.

Thư mục `mockups/`, `.playwright-cli/` và `docs/superpowers/` lưu bản sao, ảnh kiểm tra và ghi chép cục bộ, được loại khỏi Git. Repo chứa mã nguồn, script kiểm tra và toàn bộ ảnh/nhạc cần để build website.

## Deploy lên Vercel (Hobby, miễn phí)

1. Đẩy code lên GitHub (lưu ý ảnh riêng tư nếu repo public).
2. Vào [vercel.com](https://vercel.com) → Add New Project → chọn repo.
3. Vercel tự nhận **Vite**: Build Command `npm run build`, Output `dist`. Không cần biến môi trường.
4. Deploy → nhận link `https://...vercel.app`, gửi cho chị qua Messenger/Zalo.

## Cấu trúc

```
images/                 ảnh gốc (không deploy)
public/images/          ảnh WebP tối ưu (deploy)
public/art/             artwork bánh, phong thư, hộp quà, hai bàn tay tạo tim
src/data/content.ts     toàn bộ nội dung cá nhân hóa
src/data/photos.json    manifest ảnh (tự sinh)
src/components/        Cake, Botanical/Ribbon (SVG), decor, MusicToggle, Photo
src/sections/          Intro, Hero, Letter, Gallery, Wishes, SecretGift, Finale
src/lib/               celebrate, useReducedMotion
```
