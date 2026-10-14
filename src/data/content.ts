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
    src: meta ? `/images/${meta.file}` : `/images/${original}`,
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
  sisterName: 'Chị yêu',

  intro: {
    line1: 'Chị ơi, hôm nay là một ngày thật đặc biệt...',
    line2: 'Hãy ước một điều trước khi thổi nến nhé!',
    blowButton: 'Thổi nến nào ♡',
  },

  reveal: {
    title: 'Happy Birthday, Chị yêu! ♡',
    subtitle: 'Dù ở xa, em vẫn có một món quà nhỏ muốn gửi đến chị...',
    enterButton: 'Mở món quà ♡',
  },

  hero: {
    title: 'Happy Birthday, Chị yêu! ♡',
    subtitle: 'Một thế giới nhỏ mà em dành riêng cho chị.',
    body: 'Dù không thể ở gần để tặng chị một món quà tận tay, em vẫn muốn tạo nên một điều đặc biệt trong ngày sinh nhật của chị.',
    button: 'Khám phá món quà ♡',
    photo: photo(
      'd8745f52245ea400fd4f9.jpg',
      'Ba chị em mình ♡',
      'Ba chị em chụp ảnh cùng nhau bên giàn hoa giấy',
    ),
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
        'Cười thật tươi nhé, chị yêu',
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
    kicker: 'Những điều em ước cho chị',
    title: 'Bốn tấm thiệp nhỏ',
    subtitle: 'Chạm vào từng tấm thiệp để mở lời chúc nhé ♡',
    cards: [
      {
        icon: 'heart' as const,
        front: 'Luôn khỏe mạnh',
        backTitle: 'Chúc chị luôn khỏe mạnh',
        back: 'Có sức khỏe là có tất cả. Tuổi mới, mong chị ăn ngon, ngủ yên, ít ốm vặt và lúc nào cũng tràn đầy năng lượng nhé!',
      },
      {
        icon: 'sparkles' as const,
        front: 'Luôn hạnh phúc',
        backTitle: 'Chúc chị luôn hạnh phúc',
        back: 'Mong mỗi ngày của chị đều có một niềm vui nho nhỏ: một món ngon, một tin vui, hay một cái ôm ấm áp từ người thương.',
      },
      {
        icon: 'star' as const,
        front: 'Ước mơ thành hiện thực',
        backTitle: 'Mọi ước mơ thành hiện thực',
        back: 'Điều chị thầm ước lúc thổi nến — em tin chắc chắn sẽ thành hiện thực. Cứ dũng cảm bước tiếp, cả nhà luôn ủng hộ chị!',
      },
      {
        icon: 'sun' as const,
        front: 'Niềm vui & bình an',
        backTitle: 'Thật nhiều niềm vui và bình an',
        back: 'Mong chị đi đâu cũng gặp người tốt, làm gì cũng thuận lợi, và trong lòng lúc nào cũng nhẹ nhàng, bình yên.',
      },
    ],
  },

  gift: {
    kicker: 'Hộp quà bí mật',
    title: 'Chị ơi, còn một món quà nữa đó...',
    button: 'Mở món quà bí mật 🎁',
    secretMessage: 'Nào Hai về quê, em đãi Hai ănnnn',
  },

  finale: {
    line1: 'Dù khoảng cách có xa đến đâu...',
    line2: 'Em vẫn luôn thương chị. ♡',
    line3: 'Happy Birthday!',
    hugButton: 'Gửi một cái ôm ♡',
    hugMessage: 'Một cái ôm thật chặt gửi đến chị — qua màn hình nhưng từ tận đáy lòng ♡',
    replayButton: 'Xem lại khoảnh khắc sinh nhật',
  },

  footer: 'Được làm bằng tất cả tình thương ♡ — Em của chị',

  /* Đặt null để ẩn nút nhạc. */
  media: {
    music: '/audio/happy-birthday.mp3' as string | null, // Happy Birthday không lời, tổng hợp tại local.
  },
};
