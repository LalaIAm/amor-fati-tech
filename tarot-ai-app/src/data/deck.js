/**
 * Static tarot deck data — all 78 cards.
 * Major Arcana: id 0–21 (22 cards)
 * Minor Arcana: id 22–77 (56 cards across four suits)
 *
 * Each card: { id, name, arcana, suit, imageDescription, uprightKeywords, reversedKeywords }
 */

/** @type {Array<{id: number, name: string, arcana: 'major'|'minor', suit: string|undefined, imageDescription: string, uprightKeywords: string[], reversedKeywords: string[]}>} */
const deck = [
  // ── Major Arcana (0–21) ──────────────────────────────────────────────────
  {
    id: 0,
    name: "The Fool",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A young figure stands at the edge of a cliff, bindle over shoulder, gazing skyward while a small dog leaps at their heels.",
    uprightKeywords: ["beginnings", "innocence", "spontaneity", "free spirit"],
    reversedKeywords: ["recklessness", "naivety", "foolishness", "risk-taking"],
  },
  {
    id: 1,
    name: "The Magician",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A robed figure stands before a table bearing a cup, wand, sword, and pentacle, one hand raised to the sky and one pointing to the earth.",
    uprightKeywords: ["willpower", "skill", "manifestation", "resourcefulness"],
    reversedKeywords: ["manipulation", "trickery", "wasted talent", "illusion"],
  },
  {
    id: 2,
    name: "The High Priestess",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A serene woman sits between two pillars, a crescent moon at her feet, holding a scroll of hidden knowledge.",
    uprightKeywords: [
      "intuition",
      "mystery",
      "inner knowledge",
      "subconscious",
    ],
    reversedKeywords: [
      "secrets",
      "disconnection",
      "withdrawal",
      "repressed feelings",
    ],
  },
  {
    id: 3,
    name: "The Empress",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A crowned woman sits on a throne amid lush wheat fields, a shield bearing a Venus symbol resting beside her.",
    uprightKeywords: ["fertility", "abundance", "nurturing", "nature"],
    reversedKeywords: ["dependence", "smothering", "creative block", "neglect"],
  },
  {
    id: 4,
    name: "The Emperor",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "An armored ruler sits on a stone throne adorned with ram heads, holding an ankh scepter, mountains rising behind him.",
    uprightKeywords: ["authority", "structure", "stability", "leadership"],
    reversedKeywords: [
      "domination",
      "rigidity",
      "inflexibility",
      "loss of control",
    ],
  },
  {
    id: 5,
    name: "The Hierophant",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A religious figure in ceremonial robes sits between two pillars, raising a hand in blessing over two kneeling devotees.",
    uprightKeywords: [
      "tradition",
      "conformity",
      "morality",
      "spiritual guidance",
    ],
    reversedKeywords: [
      "rebellion",
      "subversiveness",
      "unconventionality",
      "dogma",
    ],
  },
  {
    id: 6,
    name: "The Lovers",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A man and woman stand beneath an angel, the Tree of Knowledge behind the woman and the Tree of Life behind the man.",
    uprightKeywords: ["love", "harmony", "relationships", "choices"],
    reversedKeywords: [
      "disharmony",
      "imbalance",
      "misalignment",
      "bad choices",
    ],
  },
  {
    id: 7,
    name: "The Chariot",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A warrior rides a chariot pulled by two sphinxes of opposing colors, a canopy of stars overhead.",
    uprightKeywords: ["control", "willpower", "victory", "determination"],
    reversedKeywords: ["lack of control", "aggression", "obstacles", "defeat"],
  },
  {
    id: 8,
    name: "Strength",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A woman gently closes the jaws of a lion, an infinity symbol floating above her head.",
    uprightKeywords: ["courage", "patience", "inner strength", "compassion"],
    reversedKeywords: ["self-doubt", "weakness", "cowardice", "raw emotion"],
  },
  {
    id: 9,
    name: "The Hermit",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "An old man in a grey cloak stands alone on a mountain peak, holding a lantern with a six-pointed star inside.",
    uprightKeywords: ["introspection", "solitude", "guidance", "inner wisdom"],
    reversedKeywords: ["isolation", "loneliness", "withdrawal", "lost"],
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A great wheel turns in the sky, bearing alchemical symbols, with a sphinx atop and serpent descending, surrounded by four winged creatures.",
    uprightKeywords: ["luck", "karma", "life cycles", "turning point"],
    reversedKeywords: ["bad luck", "resistance", "disorder", "external forces"],
  },
  {
    id: 11,
    name: "Justice",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A crowned figure sits between two pillars, holding a sword upright in one hand and scales in the other.",
    uprightKeywords: ["fairness", "truth", "cause and effect", "law"],
    reversedKeywords: [
      "unfairness",
      "dishonesty",
      "lack of accountability",
      "bias",
    ],
  },
  {
    id: 12,
    name: "The Hanged Man",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A man hangs upside down from a T-shaped cross by one foot, his expression serene, a halo of light around his head.",
    uprightKeywords: [
      "suspension",
      "surrender",
      "new perspective",
      "letting go",
    ],
    reversedKeywords: ["stalling", "resistance", "indecision", "martyrdom"],
  },
  {
    id: 13,
    name: "Death",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A skeleton in black armor rides a white horse, carrying a black flag with a white rose, as figures of all stations bow before it.",
    uprightKeywords: ["endings", "transformation", "transition", "change"],
    reversedKeywords: ["resistance to change", "stagnation", "decay", "fear"],
  },
  {
    id: 14,
    name: "Temperance",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "An angel pours water between two cups, one foot on land and one in a pool, a glowing triangle on their robe.",
    uprightKeywords: ["balance", "moderation", "patience", "purpose"],
    reversedKeywords: [
      "imbalance",
      "excess",
      "lack of long-term vision",
      "discord",
    ],
  },
  {
    id: 15,
    name: "The Devil",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A horned, bat-winged figure sits on a pedestal, two chained humans standing below, an inverted pentagram above.",
    uprightKeywords: ["bondage", "materialism", "shadow self", "addiction"],
    reversedKeywords: ["release", "reclaiming power", "detachment", "freedom"],
  },
  {
    id: 16,
    name: "The Tower",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A tall tower is struck by lightning, its crown blown off, two figures falling from the flames into darkness below.",
    uprightKeywords: ["sudden change", "upheaval", "chaos", "revelation"],
    reversedKeywords: [
      "avoidance",
      "fear of change",
      "delayed disaster",
      "narrowly avoiding",
    ],
  },
  {
    id: 17,
    name: "The Star",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A naked woman kneels by a pool, pouring water from two jugs, eight stars shining above her in a clear night sky.",
    uprightKeywords: ["hope", "inspiration", "serenity", "renewal"],
    reversedKeywords: [
      "despair",
      "lack of faith",
      "discouragement",
      "insecurity",
    ],
  },
  {
    id: 18,
    name: "The Moon",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A full moon shines between two towers, a crayfish emerging from a pool, a wolf and dog howling at the light.",
    uprightKeywords: ["illusion", "fear", "the unconscious", "confusion"],
    reversedKeywords: [
      "release of fear",
      "repressed emotion",
      "inner confusion",
      "clarity",
    ],
  },
  {
    id: 19,
    name: "The Sun",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A radiant sun shines over a joyful child riding a white horse, sunflowers blooming behind a garden wall.",
    uprightKeywords: ["positivity", "success", "vitality", "joy"],
    reversedKeywords: ["negativity", "depression", "sadness", "blocked energy"],
  },
  {
    id: 20,
    name: "Judgement",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "An angel blows a trumpet from the clouds, figures rising from coffins below with arms outstretched in awakening.",
    uprightKeywords: ["reflection", "reckoning", "awakening", "absolution"],
    reversedKeywords: [
      "self-doubt",
      "refusal of self-examination",
      "ignoring the call",
      "indecision",
    ],
  },
  {
    id: 21,
    name: "The World",
    arcana: "major",
    suit: undefined,
    imageDescription:
      "A dancing figure wrapped in a purple sash floats within a laurel wreath, four creatures in the corners of the card.",
    uprightKeywords: [
      "completion",
      "integration",
      "accomplishment",
      "wholeness",
    ],
    reversedKeywords: [
      "incompletion",
      "shortcuts",
      "delays",
      "seeking closure",
    ],
  },

  // ── Minor Arcana: Wands (id 22–35) ──────────────────────────────────────
  {
    id: 22,
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A hand emerges from a cloud gripping a flowering wand, a castle visible in the distant landscape.",
    uprightKeywords: ["inspiration", "new beginnings", "growth", "potential"],
    reversedKeywords: [
      "delays",
      "lack of motivation",
      "missed opportunity",
      "creative block",
    ],
  },
  {
    id: 23,
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A figure stands on a castle parapet holding a globe, gazing out to sea, a wand fixed to the wall beside them.",
    uprightKeywords: ["planning", "future vision", "progress", "decisions"],
    reversedKeywords: [
      "fear of unknown",
      "lack of planning",
      "playing it safe",
      "bad planning",
    ],
  },
  {
    id: 24,
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A figure stands on a cliff overlooking the sea, three wands planted in the ground, ships sailing in the distance.",
    uprightKeywords: [
      "expansion",
      "foresight",
      "overseas opportunities",
      "leadership",
    ],
    reversedKeywords: [
      "obstacles",
      "delays",
      "frustration",
      "lack of foresight",
    ],
  },
  {
    id: 25,
    name: "Four of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "Four wands form a canopy draped with flowers and fruit, two figures celebrate beneath it, a castle in the background.",
    uprightKeywords: ["celebration", "harmony", "homecoming", "community"],
    reversedKeywords: [
      "lack of support",
      "instability",
      "conflict at home",
      "transition",
    ],
  },
  {
    id: 26,
    name: "Five of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "Five young men brandish wands in apparent conflict or competition, their stances chaotic and overlapping.",
    uprightKeywords: ["conflict", "competition", "tension", "diversity"],
    reversedKeywords: [
      "avoiding conflict",
      "inner conflict",
      "compromise",
      "release of tension",
    ],
  },
  {
    id: 27,
    name: "Six of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A rider on a white horse is crowned with a laurel wreath, holding a wand aloft as a crowd cheers around them.",
    uprightKeywords: [
      "victory",
      "public recognition",
      "progress",
      "self-confidence",
    ],
    reversedKeywords: [
      "egotism",
      "disrepute",
      "lack of recognition",
      "fall from grace",
    ],
  },
  {
    id: 28,
    name: "Seven of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A figure stands on high ground, wielding a wand defensively against six wands thrust up from below.",
    uprightKeywords: [
      "challenge",
      "perseverance",
      "defensiveness",
      "maintaining position",
    ],
    reversedKeywords: ["giving up", "overwhelmed", "yielding", "self-doubt"],
  },
  {
    id: 29,
    name: "Eight of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "Eight wands fly through the air in swift parallel motion over a green landscape, suggesting rapid movement.",
    uprightKeywords: ["speed", "action", "air travel", "movement"],
    reversedKeywords: [
      "delays",
      "frustration",
      "resisting change",
      "losing momentum",
    ],
  },
  {
    id: 30,
    name: "Nine of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A weary but alert figure leans on a wand, a bandage on their head, eight wands standing in a row behind them.",
    uprightKeywords: ["resilience", "courage", "persistence", "test of faith"],
    reversedKeywords: ["exhaustion", "giving up", "paranoia", "stubbornness"],
  },
  {
    id: 31,
    name: "Ten of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A figure struggles forward under the weight of ten wands bundled in their arms, a town visible ahead.",
    uprightKeywords: [
      "burden",
      "extra responsibility",
      "hard work",
      "completion",
    ],
    reversedKeywords: [
      "inability to delegate",
      "overwhelmed",
      "burning out",
      "collapse",
    ],
  },
  {
    id: 32,
    name: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A young figure in a tunic decorated with salamanders holds a tall wand, gazing at it with curiosity in a desert landscape.",
    uprightKeywords: ["enthusiasm", "exploration", "discovery", "free spirit"],
    reversedKeywords: [
      "lack of direction",
      "immaturity",
      "hasty decisions",
      "setbacks",
    ],
  },
  {
    id: 33,
    name: "Knight of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "An armored knight on a rearing horse charges forward, holding a wand aloft, his armor decorated with salamanders.",
    uprightKeywords: ["energy", "passion", "adventure", "impulsiveness"],
    reversedKeywords: ["haste", "scattered energy", "delays", "frustration"],
  },
  {
    id: 34,
    name: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A confident queen sits on a sunflower-adorned throne, holding a wand and a sunflower, a black cat at her feet.",
    uprightKeywords: [
      "courage",
      "confidence",
      "independence",
      "social butterfly",
    ],
    reversedKeywords: ["selfishness", "jealousy", "insecurity", "demanding"],
  },
  {
    id: 35,
    name: "King of Wands",
    arcana: "minor",
    suit: "wands",
    imageDescription:
      "A regal king sits on a throne decorated with lions and salamanders, holding a flowering wand, a small salamander at his feet.",
    uprightKeywords: [
      "natural-born leader",
      "vision",
      "entrepreneur",
      "honour",
    ],
    reversedKeywords: [
      "impulsiveness",
      "overbearing",
      "unachievable expectations",
      "ruthlessness",
    ],
  },

  // ── Minor Arcana: Cups (id 36–49) ────────────────────────────────────────
  {
    id: 36,
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A hand emerges from a cloud offering an overflowing chalice, a dove descending with a communion wafer, lotus blossoms below.",
    uprightKeywords: ["new feelings", "intuition", "intimacy", "love"],
    reversedKeywords: [
      "emotional loss",
      "blocked creativity",
      "emptiness",
      "repressed emotions",
    ],
  },
  {
    id: 37,
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "Two figures exchange cups beneath a caduceus topped with a winged lion, pledging mutual connection.",
    uprightKeywords: [
      "unity",
      "partnership",
      "mutual attraction",
      "connection",
    ],
    reversedKeywords: [
      "imbalance",
      "broken communication",
      "tension",
      "withdrawal",
    ],
  },
  {
    id: 38,
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "Three women dance in a circle, raising their cups in celebration, surrounded by flowers and fruit.",
    uprightKeywords: ["celebration", "friendship", "creativity", "community"],
    reversedKeywords: ["overindulgence", "gossip", "isolation", "independence"],
  },
  {
    id: 39,
    name: "Four of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A young man sits cross-armed under a tree, contemplating three cups before him while a hand from a cloud offers a fourth.",
    uprightKeywords: ["meditation", "contemplation", "apathy", "reevaluation"],
    reversedKeywords: [
      "sudden awareness",
      "choosing happiness",
      "acceptance",
      "missed opportunity",
    ],
  },
  {
    id: 40,
    name: "Five of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A cloaked figure stares down at three spilled cups, while two upright cups stand behind them, a bridge and castle in the distance.",
    uprightKeywords: ["loss", "grief", "regret", "disappointment"],
    reversedKeywords: [
      "acceptance",
      "moving on",
      "finding peace",
      "forgiveness",
    ],
  },
  {
    id: 41,
    name: "Six of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A child offers a cup filled with flowers to a smaller child in a village courtyard, evoking nostalgia and innocence.",
    uprightKeywords: ["nostalgia", "happy memories", "reunion", "innocence"],
    reversedKeywords: [
      "stuck in the past",
      "naivety",
      "unrealistic",
      "moving forward",
    ],
  },
  {
    id: 42,
    name: "Seven of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A silhouetted figure gazes at seven cups floating in clouds, each containing a different vision or fantasy.",
    uprightKeywords: ["fantasy", "illusion", "wishful thinking", "choices"],
    reversedKeywords: [
      "alignment",
      "personal values",
      "clarity",
      "sobering up",
    ],
  },
  {
    id: 43,
    name: "Eight of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A cloaked figure walks away from eight stacked cups toward a mountainous landscape under a solar eclipse.",
    uprightKeywords: [
      "walking away",
      "disillusionment",
      "leaving behind",
      "seeking truth",
    ],
    reversedKeywords: [
      "avoidance",
      "fear of moving on",
      "aimless drifting",
      "stagnation",
    ],
  },
  {
    id: 44,
    name: "Nine of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A satisfied figure sits with arms crossed before a curved display of nine golden cups, a look of contentment on their face.",
    uprightKeywords: [
      "contentment",
      "satisfaction",
      "gratitude",
      "wish fulfilled",
    ],
    reversedKeywords: [
      "inner happiness",
      "materialism",
      "dissatisfaction",
      "indulgence",
    ],
  },
  {
    id: 45,
    name: "Ten of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A couple embraces as two children dance nearby, a rainbow arc of ten cups overhead, a house and river in the background.",
    uprightKeywords: [
      "divine love",
      "blissful relationships",
      "harmony",
      "alignment",
    ],
    reversedKeywords: [
      "disconnection",
      "misaligned values",
      "struggling relationships",
      "broken home",
    ],
  },
  {
    id: 46,
    name: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A young figure in a floral tunic holds a cup from which a fish peers out, standing by the sea with a look of surprise.",
    uprightKeywords: [
      "creative opportunities",
      "intuitive messages",
      "curiosity",
      "possibility",
    ],
    reversedKeywords: [
      "emotional immaturity",
      "insecurity",
      "disappointment",
      "creative blocks",
    ],
  },
  {
    id: 47,
    name: "Knight of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A knight on a calm white horse holds a cup aloft, his helmet and shoes adorned with wings, moving gracefully forward.",
    uprightKeywords: ["romance", "charm", "imagination", "beauty"],
    reversedKeywords: [
      "moodiness",
      "disappointment",
      "jealousy",
      "unrealistic",
    ],
  },
  {
    id: 48,
    name: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A queen sits on a throne at the water's edge, gazing at an ornate closed cup, the sea and sky merging around her.",
    uprightKeywords: [
      "compassionate",
      "caring",
      "emotionally stable",
      "intuitive",
    ],
    reversedKeywords: [
      "inner feelings",
      "self-care",
      "co-dependency",
      "martyrdom",
    ],
  },
  {
    id: 49,
    name: "King of Cups",
    arcana: "minor",
    suit: "cups",
    imageDescription:
      "A king sits on a stone throne floating amid turbulent seas, holding a cup and scepter with calm authority.",
    uprightKeywords: [
      "emotionally balanced",
      "compassionate",
      "diplomatic",
      "wise",
    ],
    reversedKeywords: [
      "self-compassion",
      "inner feelings",
      "moodiness",
      "emotionally manipulative",
    ],
  },

  // ── Minor Arcana: Swords (id 50–63) ──────────────────────────────────────
  {
    id: 50,
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A hand emerges from a cloud gripping an upright sword crowned with a wreath, mountains visible below.",
    uprightKeywords: ["breakthroughs", "clarity", "sharp mind", "truth"],
    reversedKeywords: ["confusion", "brutality", "chaos", "miscommunication"],
  },
  {
    id: 51,
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A blindfolded figure sits before a crescent moon sea, holding two crossed swords across their chest.",
    uprightKeywords: [
      "difficult choices",
      "indecision",
      "stalemate",
      "blocked emotions",
    ],
    reversedKeywords: [
      "indecision",
      "confusion",
      "information overload",
      "no right choice",
    ],
  },
  {
    id: 52,
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "Three swords pierce a red heart against a stormy grey sky with rain falling.",
    uprightKeywords: ["heartbreak", "grief", "sorrow", "rejection"],
    reversedKeywords: [
      "recovery",
      "forgiveness",
      "moving on",
      "releasing pain",
    ],
  },
  {
    id: 53,
    name: "Four of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A knight lies in effigy on a tomb, three swords on the wall above and one beneath, a stained glass window behind.",
    uprightKeywords: ["rest", "restoration", "contemplation", "recuperation"],
    reversedKeywords: ["restlessness", "burnout", "stress", "lack of progress"],
  },
  {
    id: 54,
    name: "Five of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A smirking figure collects three swords while two defeated opponents walk away, a stormy sky overhead.",
    uprightKeywords: ["conflict", "defeat", "win at all costs", "betrayal"],
    reversedKeywords: [
      "reconciliation",
      "making amends",
      "past resentment",
      "change",
    ],
  },
  {
    id: 55,
    name: "Six of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A ferryman poles a boat carrying a cloaked woman and child across calm water, six swords standing in the bow.",
    uprightKeywords: ["transition", "change", "rite of passage", "moving on"],
    reversedKeywords: [
      "personal transition",
      "resistance to change",
      "unfinished business",
      "stuck",
    ],
  },
  {
    id: 56,
    name: "Seven of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A figure sneaks away from a military camp carrying five swords, glancing back at two swords left behind.",
    uprightKeywords: [
      "betrayal",
      "deception",
      "getting away with something",
      "stealth",
    ],
    reversedKeywords: [
      "imposter syndrome",
      "self-deceit",
      "keeping secrets",
      "coming clean",
    ],
  },
  {
    id: 57,
    name: "Eight of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A bound and blindfolded figure stands surrounded by eight upright swords, water at their feet, a castle in the distance.",
    uprightKeywords: [
      "imprisonment",
      "entrapment",
      "self-victimization",
      "powerlessness",
    ],
    reversedKeywords: [
      "self-limiting beliefs",
      "inner critic",
      "releasing restrictions",
      "open to new perspectives",
    ],
  },
  {
    id: 58,
    name: "Nine of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A figure sits up in bed, head in hands, nine swords hanging on the dark wall behind them.",
    uprightKeywords: ["anxiety", "worry", "fear", "depression"],
    reversedKeywords: [
      "inner turmoil",
      "deep-seated fears",
      "secrets",
      "releasing worry",
    ],
  },
  {
    id: 59,
    name: "Ten of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A figure lies face down on the ground with ten swords in their back, a calm sea and dawn sky in the distance.",
    uprightKeywords: ["painful endings", "deep wounds", "betrayal", "loss"],
    reversedKeywords: [
      "recovery",
      "regeneration",
      "resisting an inevitable end",
      "survival",
    ],
  },
  {
    id: 60,
    name: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A young figure stands on a hilltop, sword raised and tilted, wind blowing through their hair and the trees around them.",
    uprightKeywords: [
      "new ideas",
      "curiosity",
      "thirst for knowledge",
      "new ways of communicating",
    ],
    reversedKeywords: [
      "manipulation",
      "all talk no action",
      "haste",
      "deception",
    ],
  },
  {
    id: 61,
    name: "Knight of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "An armored knight charges forward on a white horse, sword raised, clouds and trees bending in the wind behind.",
    uprightKeywords: [
      "ambitious",
      "action-oriented",
      "driven",
      "fast-thinking",
    ],
    reversedKeywords: [
      "no direction",
      "disregard for consequences",
      "unpredictability",
      "rude",
    ],
  },
  {
    id: 62,
    name: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A stern queen sits on a cloud-adorned throne, sword raised in one hand, the other extended as if in judgment.",
    uprightKeywords: [
      "independent",
      "unbiased judgement",
      "clear boundaries",
      "direct communication",
    ],
    reversedKeywords: [
      "overly emotional",
      "easily influenced",
      "bitchy",
      "cold-hearted",
    ],
  },
  {
    id: 63,
    name: "King of Swords",
    arcana: "minor",
    suit: "swords",
    imageDescription:
      "A king sits on a throne decorated with butterflies and angels, holding a sword upright, clouds and birds behind him.",
    uprightKeywords: [
      "clear thinking",
      "intellectual power",
      "authority",
      "truth",
    ],
    reversedKeywords: ["manipulative", "cruel", "weakness", "irrational"],
  },

  // ── Minor Arcana: Pentacles (id 64–77) ───────────────────────────────────
  {
    id: 64,
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A hand emerges from a cloud offering a large golden pentacle, a garden archway leading to mountains beyond.",
    uprightKeywords: [
      "opportunity",
      "prosperity",
      "new venture",
      "manifestation",
    ],
    reversedKeywords: [
      "lost opportunity",
      "missed chance",
      "bad investment",
      "scarcity",
    ],
  },
  {
    id: 65,
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A figure juggles two pentacles connected by an infinity loop, ships riding waves in the background.",
    uprightKeywords: [
      "multiple priorities",
      "time management",
      "prioritization",
      "adaptability",
    ],
    reversedKeywords: [
      "over-committed",
      "disorganization",
      "reprioritization",
      "financial disarray",
    ],
  },
  {
    id: 66,
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A craftsman works on a cathedral arch while two robed figures consult architectural plans, collaboration evident.",
    uprightKeywords: [
      "teamwork",
      "collaboration",
      "learning",
      "implementation",
    ],
    reversedKeywords: [
      "disharmony",
      "misalignment",
      "working alone",
      "lack of teamwork",
    ],
  },
  {
    id: 67,
    name: "Four of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A crowned figure clutches a pentacle to their chest, one under each foot and one balanced on their head, a city behind them.",
    uprightKeywords: ["saving money", "security", "conservatism", "scarcity"],
    reversedKeywords: [
      "over-spending",
      "greed",
      "self-protection",
      "materialism",
    ],
  },
  {
    id: 68,
    name: "Five of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "Two impoverished figures trudge through snow past a lit stained glass window, one on crutches, both in rags.",
    uprightKeywords: ["financial loss", "poverty", "lack mindset", "isolation"],
    reversedKeywords: [
      "recovery from financial loss",
      "spiritual poverty",
      "new hope",
      "improvement",
    ],
  },
  {
    id: 69,
    name: "Six of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A wealthy merchant weighs coins on a scale and distributes them to two kneeling beggars.",
    uprightKeywords: ["giving", "receiving", "sharing wealth", "generosity"],
    reversedKeywords: [
      "self-care",
      "unpaid debts",
      "one-sided charity",
      "power dynamics",
    ],
  },
  {
    id: 70,
    name: "Seven of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A farmer leans on their hoe, pausing to contemplate seven pentacles growing on a lush vine.",
    uprightKeywords: [
      "long-term vision",
      "sustainable results",
      "perseverance",
      "investment",
    ],
    reversedKeywords: [
      "lack of long-term vision",
      "limited success",
      "impatience",
      "no reward",
    ],
  },
  {
    id: 71,
    name: "Eight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A craftsman sits at a workbench carefully engraving pentacles, six completed and displayed, a town in the distance.",
    uprightKeywords: [
      "apprenticeship",
      "repetitive tasks",
      "mastery",
      "skill development",
    ],
    reversedKeywords: [
      "self-development",
      "perfectionism",
      "misdirected activity",
      "lack of focus",
    ],
  },
  {
    id: 72,
    name: "Nine of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "An elegantly dressed woman stands in a lush vineyard, a hooded falcon on her gloved hand, nine pentacles surrounding her.",
    uprightKeywords: [
      "abundance",
      "luxury",
      "self-sufficiency",
      "financial independence",
    ],
    reversedKeywords: [
      "self-worth",
      "over-investment in work",
      "hustling",
      "financial setbacks",
    ],
  },
  {
    id: 73,
    name: "Ten of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "An elder sits beneath an archway as a couple and child pass by, two dogs at their feet, ten pentacles arranged in the Tree of Life.",
    uprightKeywords: [
      "wealth",
      "financial security",
      "family",
      "long-term success",
    ],
    reversedKeywords: [
      "financial failure",
      "loneliness",
      "loss of stability",
      "family disputes",
    ],
  },
  {
    id: 74,
    name: "Page of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A young figure stands in a flowering meadow, gazing intently at a pentacle held aloft in both hands.",
    uprightKeywords: [
      "manifestation",
      "financial opportunity",
      "skill development",
      "new beginnings",
    ],
    reversedKeywords: [
      "lack of progress",
      "procrastination",
      "learn from failure",
      "missed opportunities",
    ],
  },
  {
    id: 75,
    name: "Knight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A knight sits motionless on a heavy black horse in a plowed field, holding a pentacle and surveying the land.",
    uprightKeywords: ["hard work", "productivity", "routine", "conservatism"],
    reversedKeywords: [
      "self-discipline",
      "boredom",
      "feeling stuck",
      "perfectionism",
    ],
  },
  {
    id: 76,
    name: "Queen of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A queen sits on a flower-adorned throne in a lush garden, cradling a pentacle in her lap, a rabbit leaping nearby.",
    uprightKeywords: [
      "nurturing",
      "practical",
      "providing financially",
      "a working parent",
    ],
    reversedKeywords: [
      "financial independence",
      "self-care",
      "work-home conflict",
      "smothering",
    ],
  },
  {
    id: 77,
    name: "King of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    imageDescription:
      "A king sits on a bull-adorned throne in a garden, robes covered in grapes and vines, a pentacle resting in his lap.",
    uprightKeywords: ["wealth", "business", "leadership", "security"],
    reversedKeywords: [
      "financially inept",
      "obsessed with wealth",
      "stubborn",
      "corruption",
    ],
  },
];

export default deck;
