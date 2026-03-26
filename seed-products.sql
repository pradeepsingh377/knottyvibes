-- Seed products — update prices before running or after
-- Images use picsum placeholders; replace with real photos later

INSERT INTO products (name, slug, description, price, compare_price, category, images, stock, is_featured, tags) VALUES

-- WOOLEN JEWELLERY (5)
(
  'Boho Woolen Flower Earrings',
  'boho-woolen-flower-earrings',
  'Delicate handcrafted woolen flower earrings in soft pastel shades. Lightweight and perfect for everyday wear. Each pair is uniquely made with love.',
  299, 399, 'woolen-jewellery',
  ARRAY['https://picsum.photos/seed/woolearring1/600/600', 'https://picsum.photos/seed/woolearring1b/600/600'],
  20, true, ARRAY['earrings', 'boho', 'flowers', 'pastel']
),
(
  'Layered Woolen Bead Necklace',
  'layered-woolen-bead-necklace',
  'A stunning layered necklace combining woolen tassels and handmade beads. Adds a pop of colour to any outfit. Adjustable length.',
  449, 599, 'woolen-jewellery',
  ARRAY['https://picsum.photos/seed/woolnecklace1/600/600', 'https://picsum.photos/seed/woolnecklace1b/600/600'],
  15, true, ARRAY['necklace', 'layered', 'beads', 'colourful']
),
(
  'Woolen Pom Pom Stud Earrings',
  'woolen-pom-pom-stud-earrings',
  'Tiny and adorable pom pom studs in vibrant colours. Made with soft merino wool. Great as a gift or a treat for yourself.',
  199, 249, 'woolen-jewellery',
  ARRAY['https://picsum.photos/seed/pompomstud1/600/600'],
  30, false, ARRAY['earrings', 'studs', 'pom pom', 'cute']
),
(
  'Handwoven Woolen Cuff Bracelet',
  'handwoven-woolen-cuff-bracelet',
  'A bold and beautiful cuff bracelet handwoven in earthy tones. Inspired by tribal patterns. One size fits most.',
  349, 449, 'woolen-jewellery',
  ARRAY['https://picsum.photos/seed/woolbracelet1/600/600', 'https://picsum.photos/seed/woolbracelet1b/600/600'],
  12, true, ARRAY['bracelet', 'cuff', 'tribal', 'earthy']
),
(
  'Tassel Drop Earrings',
  'tassel-drop-earrings',
  'Long and flowy woolen tassel earrings that move beautifully. Available in multiple colour combinations. Statement piece for any occasion.',
  249, 349, 'woolen-jewellery',
  ARRAY['https://picsum.photos/seed/tasselearring1/600/600'],
  25, false, ARRAY['earrings', 'tassel', 'drop', 'statement']
),

-- HAIR ACCESSORIES (5)
(
  'Chunky Woolen Scrunchie Set',
  'chunky-woolen-scrunchie-set',
  'Set of 3 chunky handmade woolen scrunchies in coordinating colours. Gentle on hair, no breakage. Perfect for thick and thin hair alike.',
  249, 349, 'hair-accessories',
  ARRAY['https://picsum.photos/seed/woolscrunchie1/600/600', 'https://picsum.photos/seed/woolscrunchie1b/600/600'],
  40, true, ARRAY['scrunchie', 'set', 'hair', 'chunky']
),
(
  'Woolen Flower Hair Clip',
  'woolen-flower-hair-clip',
  'A gorgeous oversized woolen flower hair clip that makes any hairstyle look special. Sturdy clip base, handmade woolen bloom on top.',
  199, 269, 'hair-accessories',
  ARRAY['https://picsum.photos/seed/woolhairclip1/600/600'],
  35, true, ARRAY['hair clip', 'flower', 'handmade']
),
(
  'Braided Woolen Headband',
  'braided-woolen-headband',
  'A thick braided headband in soft wool. Keeps hair back while looking absolutely stylish. One size fits all with a stretch elastic base.',
  299, 379, 'hair-accessories',
  ARRAY['https://picsum.photos/seed/woolheadband1/600/600', 'https://picsum.photos/seed/woolheadband1b/600/600'],
  20, false, ARRAY['headband', 'braided', 'boho']
),
(
  'Pom Pom Hair Ties (Pack of 4)',
  'pom-pom-hair-ties-pack-4',
  'Four adorable pom pom hair ties in bright colours. Makes ponytails and braids extra fun. Great gift for kids and adults alike.',
  179, 229, 'hair-accessories',
  ARRAY['https://picsum.photos/seed/pomhairties1/600/600'],
  50, false, ARRAY['hair ties', 'pom pom', 'fun', 'kids']
),
(
  'Boho Woolen Hair Wrap',
  'boho-woolen-hair-wrap',
  'A long woolen wrap to weave through braids or tie around a bun. Inspired by festival fashion. Comes in earthy and jewel tone options.',
  329, 429, 'hair-accessories',
  ARRAY['https://picsum.photos/seed/woolhairwrap1/600/600', 'https://picsum.photos/seed/woolhairwrap1b/600/600'],
  18, true, ARRAY['hair wrap', 'boho', 'festival', 'braid']
),

-- HOME DECOR (5)
(
  'Woolen Wall Hanging — Sunrise',
  'woolen-wall-hanging-sunrise',
  'A stunning handwoven wall hanging in warm sunrise colours — orange, yellow, and rust. Each piece is one of a kind. Includes a wooden dowel.',
  799, 999, 'home-decor',
  ARRAY['https://picsum.photos/seed/wallhang1/600/600', 'https://picsum.photos/seed/wallhang1b/600/600'],
  8, true, ARRAY['wall hanging', 'woven', 'sunrise', 'home']
),
(
  'Woolen Rainbow Table Coaster Set',
  'woolen-rainbow-table-coaster-set',
  'Set of 4 handmade woolen coasters in rainbow colours. Protects your table and brightens your space. Packed in a gift-ready box.',
  349, 449, 'home-decor',
  ARRAY['https://picsum.photos/seed/woolcoaster1/600/600'],
  22, false, ARRAY['coasters', 'rainbow', 'set', 'gift']
),
(
  'Woolen Flower Wreath',
  'woolen-flower-wreath',
  'A beautiful handcrafted wreath made entirely of woolen flowers in seasonal colours. Perfect for front doors, walls, or as a centrepiece.',
  649, 849, 'home-decor',
  ARRAY['https://picsum.photos/seed/woolwreath1/600/600', 'https://picsum.photos/seed/woolwreath1b/600/600'],
  10, true, ARRAY['wreath', 'flowers', 'decor', 'handmade']
),
(
  'Mini Woolen Potted Plant Decor',
  'mini-woolen-potted-plant-decor',
  'Adorable miniature woolen plants in tiny terracotta pots. Zero maintenance, maximum cuteness. Great for desks, shelves, and gifting.',
  449, 549, 'home-decor',
  ARRAY['https://picsum.photos/seed/woolplant1/600/600'],
  15, false, ARRAY['plant', 'mini', 'desk decor', 'gift']
),
(
  'Woolen Cushion Cover — Floral',
  'woolen-cushion-cover-floral',
  'Handmade woolen cushion cover with an embroidered floral design. Fits standard 16×16 inch cushions. Adds warmth and colour to any sofa.',
  599, 799, 'home-decor',
  ARRAY['https://picsum.photos/seed/woolcushion1/600/600', 'https://picsum.photos/seed/woolcushion1b/600/600'],
  12, true, ARRAY['cushion', 'cover', 'floral', 'home']
),

-- KEYCHAINS & CHARMS (5)
(
  'Woolen Pom Pom Keychain',
  'woolen-pom-pom-keychain',
  'A big fluffy pom pom keychain in your choice of colour. Soft, bouncy, and impossible not to love. Comes with a sturdy metal key ring.',
  149, 199, 'keychains',
  ARRAY['https://picsum.photos/seed/woolkeychain1/600/600'],
  60, true, ARRAY['keychain', 'pom pom', 'fluffy', 'colourful']
),
(
  'Woolen Animal Bag Charm — Bear',
  'woolen-animal-bag-charm-bear',
  'A tiny adorable bear made entirely from wool. Attach to your bag, keys, or backpack zip. Each bear has its own little personality.',
  199, 249, 'keychains',
  ARRAY['https://picsum.photos/seed/woolbearcharm1/600/600', 'https://picsum.photos/seed/woolbearcharm1b/600/600'],
  30, true, ARRAY['bag charm', 'bear', 'animal', 'cute']
),
(
  'Tassel & Bead Keychain',
  'tassel-bead-keychain',
  'A boho-style keychain with woolen tassels and hand-strung beads. Makes a great gift. Available in multiple colour combinations.',
  179, 229, 'keychains',
  ARRAY['https://picsum.photos/seed/tasselbead1/600/600'],
  45, false, ARRAY['keychain', 'tassel', 'beads', 'boho']
),
(
  'Woolen Initial Keychain',
  'woolen-initial-keychain',
  'Personalised woolen keychain with your initial. A thoughtful and unique gift. Available in all letters A–Z. Choose your colour too.',
  229, 299, 'keychains',
  ARRAY['https://picsum.photos/seed/initialkey1/600/600'],
  40, false, ARRAY['keychain', 'personalised', 'initial', 'gift']
),
(
  'Woolen Flower Bouquet Charm',
  'woolen-flower-bouquet-charm',
  'A miniature woolen flower bouquet charm — like a tiny gift in your hand. Attach to bags, journals, or gift wrapping. Truly one of a kind.',
  249, 329, 'keychains',
  ARRAY['https://picsum.photos/seed/woolbouquet1/600/600', 'https://picsum.photos/seed/woolbouquet1b/600/600'],
  20, true, ARRAY['charm', 'flowers', 'bouquet', 'miniature']
);
