import photosManifest from './photos.json';

export interface PhotoMeta {
  id: string;
  file: string;
  width: number;
  height: number;
  original: string;
}

const manifest = photosManifest as unknown as PhotoMeta[];
const byFile = new Map(manifest.map((p) => [p.original, p]));

function photo(original: string, caption: string, alt: string) {
  const meta = byFile.get(original);
  // Falls back gracefully if the manifest wasn't regenerated yet.
  return {
    src: `${import.meta.env.BASE_URL}images/${meta?.file ?? original}`,
    width: meta?.width ?? 1200,
    height: meta?.height ?? 1600,
    caption,
    alt,
  };
}

export interface PhotoItem {
  src: string;
  width: number;
  height: number;
  caption: string;
  alt: string;
}

/* ------------------------------------------------------------------ */
/*  Mọi nội dung cá nhân hóa nằm ở đây — sửa file này là đủ.           */
/* ------------------------------------------------------------------ */
export const content = {
  sisterName: 'Chị 2',

  intro: {
    line1: 'Chúc mừng sinh nhật Chị 2!',
    line2: 'Ước một điều rồi thổi nến nhé!',
    blowButton: 'Thổi nến nào ♡',
  },

  reveal: {
    title: 'Chúc mừng sinh nhật Chị 2!',
    subtitle: 'Một món quà nhỏ em tự làm để tặng chị.',
    enterButton: 'Mở món quà ♡',
  },

  hero: {
    kicker: 'Dành tặng Chị 2',
    title: 'Happy Birthday, Chị 2!',
    subtitle: 'Chị 2 là người chị tuyệt vời nhất!',
    body: 'Cảm ơn chị đã luôn giúp đỡ và ủng hộ em trong học tập. Website này là món quà sinh nhật em tự làm dành cho chị.',
    button: 'Khám phá món quà ♡',
    photo: photo(
      'd8745f52245ea400fd4f9.jpg',
      'Ba chị em mình ♡',
      'Ba chị em chụp ảnh cùng nhau bên giàn hoa giấy',
    ),
  },

  letter: {
    kicker: 'Lời nhắn của em',
    title: 'Gửi Chị 2',
    greeting: 'Chị 2 ơi,',
    birthday: 'Chúc mừng sinh nhật Chị 2!',
    paragraphs: [
      'Cảm ơn Chị 2 đã luôn ủng hộ em trong học tập, giúp đỡ và chỉ dẫn cho em mỗi khi cần. Với em, Chị 2 là người chị tuyệt vời nhất!',
      'Chúc chị tuổi mới luôn khỏe mạnh, vui vẻ và công việc thuận lợi. Mong những dự định của chị đều sớm thành công. Hôm nay nhớ ăn ngon và tận hưởng sinh nhật nhé!',
    ],
    sign: 'Sinh nhật vui vẻ nhé!',
    signName: 'Em của chị ♡',
  },

  gallery: {
    kicker: 'Album kỷ niệm',
    title: 'Những khoảnh khắc của chúng mình',
    subtitle: 'Chạm vào từng tấm ảnh để xem rõ hơn nhé ♡',
    photos: [
      photo(
        '22f514656f69ef37b6787.jpg',
        'Hai chị em mình',
        'Hai chị em mặc áo đỏ chụp ảnh cùng nhau',
      ),
      photo(
        '35904eb234beb4e0edaf12.jpg',
        'Cả nhà mình, lúc nào cũng đầy ắp tiếng cười',
        'Cả gia đình chụp ảnh cùng nhau trên ban công nhìn ra biển',
      ),
      photo(
        'e058928cea806ade33914.jpg',
        'Những buổi tối ngồi lại bên nhau',
        'Ba chị em ngồi uống nước cùng nhau buổi tối',
      ),
      photo(
        '0c8402eb7be7fbb9a2f61.jpg',
        'Tụi mình — chỉ cần bên nhau là vui',
        'Ảnh selfie của cả nhóm ngoài trời',
      ),
      photo(
        'bb227cea04e684b8ddf73.jpg',
        'Ngày Tết sum vầy',
        'Bốn người chụp ảnh ngày Tết bên cây mai',
      ),
      photo(
        '4edd69791375932bca6411.jpg',
        'Dạo phố đêm cùng nhau',
        'Hai người chụp ảnh ở phố đi bộ về đêm',
      ),
      photo(
        'a702d209aa052a5b73145.jpg',
        'Ba chị em, đi đâu cũng có nhau',
        'Ba chị em chụp ảnh ở quảng trường lúc chiều tà',
      ),
      photo(
        'ad4d1f2e6722e77cbe336.jpg',
        'Gia đình là nơi bình yên nhất',
        'Ảnh selfie gia đình sum họp trong nhà',
      ),
      photo(
        '0f3667b01fbc9fe2c6ad2.jpg',
        'Cười thật tươi nhé, Chị 2',
        'Ảnh selfie nhóm bạn trẻ ngoài trời',
      ),
      photo(
        '8b1216786d74ed2ab46510.jpg',
        'Một ngày đẹp trời của cả nhà',
        'Bốn người chụp ảnh trước sân chùa',
      ),
      photo(
        'fc1a80d3fbdf7b8122ce8.jpg',
        'Tay trong tay, năm nào cũng vậy',
        'Bốn người tạo dáng vui vẻ ngày Tết',
      ),
    ] satisfies PhotoItem[],
  },

  wishes: {
    kicker: 'Chúc Chị 2 tuổi mới',
    title: 'Bốn lời chúc gửi chị',
    subtitle: 'Mở từng tấm thiệp để đọc nhé.',
    cards: [
      {
        icon: 'heart' as const,
        front: 'Luôn khỏe mạnh',
        backTitle: 'Chúc chị luôn khỏe mạnh',
        back: 'Chúc Chị 2 luôn khỏe mạnh, ăn ngon, ngủ ngon và có nhiều năng lượng để làm những điều mình thích.',
      },
      {
        icon: 'sparkles' as const,
        front: 'Vui vẻ mỗi ngày',
        backTitle: 'Ngày nào cũng có niềm vui',
        back: 'Chúc Chị 2 cười thật nhiều, ngày nào cũng có chuyện vui, có thời gian nghỉ ngơi và gặp gỡ bạn bè.',
      },
      {
        icon: 'star' as const,
        front: 'Công việc thuận lợi',
        backTitle: 'Thật nhiều thành công',
        back: 'Chúc những dự định của Chị 2 sớm thành công, làm gì cũng thuận lợi. Cả nhà luôn ủng hộ chị!',
      },
      {
        icon: 'sun' as const,
        front: 'May mắn & bình an',
        backTitle: 'Tuổi mới nhiều may mắn',
        back: 'Chúc Chị 2 gặp nhiều may mắn, mọi chuyện đều ổn và có thêm nhiều kỷ niệm vui cùng gia đình. Sinh nhật vui vẻ!',
      },
    ],
  },

  gift: {
    kicker: 'Hộp quà bí mật',
    title: 'Còn một món quà cho Chị 2',
    button: 'Mở món quà bí mật 🎁',
    secretMessage: 'Nào Hai về quê, em đãi Hai ănnnn',
  },

  finale: {
    line1: 'Cảm ơn Chị 2 vì luôn giúp đỡ em.',
    line2: 'Sinh nhật vui vẻ, Chị 2!',
    line3: 'Tuổi mới thật nhiều niềm vui nhé!',
    hugButton: 'Gửi một cái ôm ♡',
    hugMessage: 'Gửi Chị 2 một cái ôm. Nào về quê gặp nhau nhé!',
    replayButton: 'Xem lại khoảnh khắc sinh nhật',
  },

  footer: 'Em tự làm website này tặng Chị 2.',

  /* Đặt null để ẩn nút nhạc. */
  media: {
    music: `${import.meta.env.BASE_URL}audio/happy-birthday.mp3` as string | null, // Happy Birthday không lời, tổng hợp tại local.
  },
};
