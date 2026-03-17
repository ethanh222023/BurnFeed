const QUIZ_QUESTIONS = [
  {
    id: "q1",
    type: "text",
    question: "What is your name?",
    placeholder: "Type your answer here...",
    required: true
  },
  {
    id: "q2",
    question: "Can you drive?",
    options: [
      "Yes",
      "No",
      "I am missing a day/finding my own way there"
    ]
  },
  {
    id: "q3",
    question: "What is the maximum amount of people other than you that you can drive?",
    options: [
      "0 / I cannot drive",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6"
    ]
  },
  {
    id: "q4",
    question: "What time can you leave on Friday?",
    options: [
      "2-4",
      "4-6",
      "6-8",
      "8+",
      "Whenever"
    ]
  },
  {
    id: "q5",
    type: "text",
    question: "Any other notes regarding rides? If you are coming on your own/missing a day, include that here",
    placeholder: "Optional",
    required: false
  },
  {
    id: "q6",
    question: "If CT is on fire and you can only save 1 person, who would you save?",
    options: [
      "Coby",
      "Pookie",
      "Ethan",
      "Trent"
    ]
  },
  {
    id: "q7",
    question: "Max times gooned in a day?",
    options: [
      "3",
      "4",
      "5",
      "6+"
    ]
  },
  {
    id: "q8",
    question: "Which would you rather?",
    options: [
      "Orgasm every time you cough",
      "Have your grandma walk in on you doing it",
      "Use a toothbrush that has been dropped in a public toilet",
      "Kiss a random person in a subway station"
    ]
  },
  {
    id: "q9",
    question: "Think about it hard. If all 8 billion people in the world voted to keep either tortillas or weed, which would win?",
    options: [
      "Tortillas",
      "Weed"
    ]
  },
  {
    id: "q10",
    question: "Ethan, Goob, Matthew, and Jack all ask you for a quarter. Who are you giving it to?",
    options: [
      "Ethan",
      "Goob",
      "Matthew",
      "Jack"
    ]
  }
];

const MATCHES = [
  {
    id: 1,
    name: "AOC",
    image: "assets/matches/AOC.JPG",
    text: [
      "AOC has the kind of smile that could get away with light treason and still have you offering them a jacket. They flirt like they've been professionally trained by rom-coms and a tiny bit of arrogance.",
      "You two work because Avery makes everything feel like an event, even standing in line for coffee. They'll hype you up, steal one bite of your food, and somehow make that feel intimate instead of criminal."
    ]
  },
  {
    id: 2,
    name: "Alex",
    image: "assets/matches/Alex.PNG",
    text: [
      "Alex has dangerous forearm energy and the deeply unfair habit of remembering every little thing you say. You mention one childhood snack once, and suddenly it's waiting for you on the passenger seat.",
      "This match is giving banter, loyalty, and the exact kind of eye contact that should probably require a permit. Blake will roast you lightly, then look at you like you're the best plot twist of the year."
    ]
  },
  {
    id: 3,
    name: "Alper",
    image: "assets/matches/Alper.JPG",
    text: [
      "Alper is equal parts chaos and competence, which is a disgusting combination because it is wildly attractive. They'd forget where their keys are, then flawlessly plan a weekend trip in six minutes.",
      "You're matched because Casey keeps your life interesting without turning it into a small disaster. They flirt by making you laugh so hard you accidentally reveal your feelings. Rude, but effective."
    ]
  },
  {
    id: 4,
    name: "Ben",
    image: "assets/matches/Ben.JPG",
    text: [
      "Ben has calm, magnetic energy, like they know exactly what they're doing and refuse to explain it. Their version of romance is subtle, sharp, and just smug enough to keep you leaning in.",
      "This pairing works because Ben grounds you without ever being boring. They're the type to open the car door, hand you your favorite drink, and pretend that level of charm is normal human behavior."
    ]
  },
  {
    id: 5,
    name: "Brady",
    image: "assets/matches/Brady.PNG",
    text: [
      "Brady looks like they were built in a lab to ruin your concentration. Soft voice, stupidly good outfits, and the social confidence of someone who knows exactly how much damage they're doing.",
      "You fit because Emerson brings sweetness with just enough menace to keep things lively. They'll flirt with a compliment, then follow it with a joke so you're never fully emotionally prepared."
    ]
  },
  {
    id: 6,
    name: "Brandon",
    image: "assets/matches/Brandon.JPG",
    text: [
      "Brandon is the human equivalent of a late-night drive with perfect music and one conversation that changes your brain chemistry. They're warm, witty, and way too good at reading your face.",
      "This match has excellent chemistry because Brandon makes you feel seen without making it weird. They'd absolutely brush hair out of your face and then act like they weren't just outrageously attractive on purpose."
    ]
  },
  {
    id: 7,
    name: "Bruther",
    image: "assets/matches/Bruther.JPG",
    text: [
      "Bruther is cool in that effortless way that makes everyone else look like they're trying too hard. Their flirting strategy is mostly smirking, showing up, and somehow being better at everything than is polite.",
      "You're a fit because Bruther likes someone who can keep up. The vibe here is equal parts tension and teamwork, with just enough mock rivalry to make every conversation feel like foreplay with better punctuation."
    ]
  },
  {
    id: 8,
    name: "Carter",
    image: "assets/matches/Carter.JPG",
    text: [
      "Carter has golden-retriever charisma in a very good jacket. They'll drag you into fun plans, make friends with strangers, and then look back for you first like the entire room was just filler content.",
      "This pairing works because Carter keeps things bright without feeling shallow. They're romantic in a surprisingly attentive way, which means flowers, forehead kisses, and at least one dramatic grocery-store dance moment."
    ]
  },
  {
    id: 9,
    name: "Coby",
    image: "assets/matches/Coby.JPG",
    text: [
      "Coby seems mysterious until they start laughing, then suddenly the whole act falls apart in the best way. They're sharp, observant, and carry the exact amount of emotional depth needed to be dangerous.",
      "You're matched because Coby turns quiet moments into the main event. They'd sit beside you in complete silence, bump your knee against theirs, and somehow that would be more intimate than half the world's relationships."
    ]
  },
  {
    id: 10,
    name: "Crispy",
    image: "assets/matches/Crispy.JPG",
    text: [
      "Crispy is a flirt disguised as a responsible person. They answer texts, make reservations, and still manage to radiate the kind of charm that makes your friends narrow their eyes suspiciously.",
      "This is a strong match because Crispy gives effort without making it look performative. They'd remember your exam date, hype you up, and then celebrate afterward like your success was their favorite hobby."
    ]
  },
  {
    id: 11,
    name: "Ethan",
    image: "assets/matches/Ethan.JPG",
    text: [
      "Ethan is built for slow-burn romance and irritating levels of physical attractiveness. They somehow make hoodies, eye contact, and asking if you got home safe feel like elite-level courtship.",
      "You're paired with Ethan because they bring stability with just enough spark to keep your pulse involved. Their flirting style is protective, teasing, and one hundred percent designed to leave you staring at the wall afterward."
    ]
  },
  {
    id: 12,
    name: "Matthew",
    image: "assets/matches/Friedberg.JPG",
    text: [
      "Matthew has the energy of someone who'd carry all your bags and then make you laugh the entire walk back. They are charming in a low-maintenance, suspiciously effective way.",
      "This match works because Matthew makes affection feel easy. They'll send you a terrible meme, then follow up with a genuinely thoughtful check-in, which is annoyingly compelling and frankly unfair to the rest of society."
    ]
  },
  {
    id: 13,
    name: "Gavin",
    image: "assets/matches/Gavin.JPG",
    text: [
      "Gavin looks like they know a secret and you are absolutely desperate to hear it. Elegant, funny, and quietly devastating, they could ruin your sleep schedule with one grin.",
      "You're a fit because Gavin brings serious chemistry and zero dull moments. They flirt like every sentence has layers, which means you'll spend half your time laughing and the other half realizing that was definitely a double meaning."
    ]
  },
  {
    id: 14,
    name: "Goob",
    image: "assets/matches/Goob.PNG",
    text: [
      "Goob is sweet in a way that makes people underestimate them, which is convenient because then they get to be funny, clever, and absurdly charming as a surprise attack.",
      "This pairing has peak comfort-meets-spark energy. Goob will make your favorite snack appear out of nowhere, call you out when you're being dramatic, and still look at you like you're the prettiest inconvenience in the room."
    ]
  },
  {
    id: 15,
    name: "Holly",
    image: "assets/matches/Holly.JPG",
    text: [
      "Holly has outdoorsy competence with indoor cuddle potential, a combination civilization is not prepared for. They can fix a tire, make a fire, and still flirt like a menace over brunch.",
      "You two work because Holly balances adventure with softness. They'll drag you into a ridiculous plan, then hand you a blanket and a snack like they personally intend to keep your nervous system regulated."
    ]
  },
  {
    id: 16,
    name: "Ken",
    image: "assets/matches/Ken.JPG",
    text: [
      "Ken is the one your friends clock immediately because their face says trouble and their behavior says husband material. That kind of contradiction is catnip for the human brain apparently.",
      "This match hits because Ken is playful without being flaky. Expect top-tier banter, arm-around-the-shoulder energy, and a level of attention that makes mediocre dating options look even more embarrassing than usual."
    ]
  },
  {
    id: 17,
    name: "Levi",
    image: "assets/matches/Levi.PNG",
    text: [
      "Levi has a clean laugh, excellent timing, and just enough nerve to flirt in public without combusting. Their confidence is attractive because it's grounded, not because they're auditioning for a cologne ad.",
      "You're matched because Levi would absolutely become your favorite person to debrief life with. They make everyday routines feel intimate, which is dangerous, because now even errands will have chemistry."
    ]
  },
  {
    id: 18,
    name: "Link",
    image: "assets/matches/Link.JPG",
    text: [
      "Link is witty, stylish, and alarmingly good at saying exactly the thing that gets under your skin in a fun way. They flirt like a challenge and kiss like a reward, allegedly.",
      "This pairing works because Link keeps your attention without draining your peace. They know when to stir things up, when to soften, and when to hand you food before your mood becomes a public issue."
    ]
  },
  {
    id: 19,
    name: "Micah",
    image: "assets/matches/Micah.PNG",
    text: [
      "Micah is the sort of person who makes everyone feel comfortable, then quietly turns around and absolutely wrecks one specific person's emotional stability. Congratulations, that person is probably you.",
      "You're a fit because Micah mixes gentleness with just enough flirtatious menace. They'll check in on your day, walk on the outside of the sidewalk, and then grin at you like they know exactly what that's doing."
    ]
  },
  {
    id: 20,
    name: "Muff",
    image: "assets/matches/Muff.JPG",
    text: [
      "Muff has the moody, cinematic vibe people pretend they don't fall for and then absolutely do. Great hair, suspiciously good playlists, and a stare that should come with a warning label.",
      "This match works because Muff is all depth and payoff. They may look intense, but under that dramatic packaging is someone loyal, funny, and weirdly thrilled to make your life easier in small beautiful ways."
    ]
  },
  {
    id: 21,
    name: "Piyush",
    image: "assets/matches/Piyush.JPG",
    text: [
      "Piyush is charming without being loud about it, which somehow makes it hit harder. They listen closely, speak carefully, and then blindside you by being funnier than half the room.",
      "You're paired with Piyush because they bring balance to the nonsense. They have major hand-on-lower-back energy, elite taste in date ideas, and the exact right amount of emotional intelligence to be completely lethal."
    ]
  },
  {
    id: 22,
    name: "Pookie",
    image: "assets/matches/Pookie.JPG",
    text: [
      "Pookie has chaotic flirt energy but organized life skills, which is exactly the kind of contradiction that gets people emotionally attached in record time. It's embarrassing, but there it is.",
      "This pairing works because Pookie keeps things playful while still showing up. They'll challenge you to ridiculous games, let you win once out of mercy, and then kiss you like they were planning that all along."
    ]
  },
  {
    id: 23,
    name: "Aiden Reed",
    image: "assets/matches/Reed.JPG",
    text: [
      "Aiden has quiet confidence and the kind of smile that makes rooms seem smaller. They're patient, observant, and very good at creating the illusion that you are the only person worth paying attention to.",
      "You're matched because Aiden is the soft-spoken problem your love life deserves. Expect thoughtful dates, subtle flirting, and a voice note that somehow turns your entire evening into a daydream."
    ]
  },
  {
    id: 24,
    name: "Robbie",
    image: "assets/matches/Robbie.JPG",
    text: [
      "Robbie is pure magnetism with a side of nonsense. They look expensive, laugh loudly, and carry themselves like someone who knows life is short and chemistry should be entertaining.",
      "This match works because Robbie makes bold feel safe. They'll tell you you're gorgeous like it's an objective fact, then drag you into a chaotic memory you'll both pretend happened naturally."
    ]
  },
  {
    id: 25,
    name: "Scrat",
    image: "assets/matches/Scrat.JPG",
    text: [
      "Scrat is a little bit smug and completely justified about it. They're competent, affectionate, and very likely to text you something mildly flirty right when you were trying to be productive.",
      "You're a match because Scrat thrives on chemistry with substance. They'll make you laugh, make you feel wanted, and make your standards rise enough to inconvenience future alternatives."
    ]
  },
  {
    id: 26,
    name: "Sigeti",
    image: "assets/matches/Sigeti.JPG",
    text: [
      "Sigeti has romantic menace in the best possible way. Their whole thing is acting casual while doing devastatingly attentive things like handing you your favorite drink without asking.",
      "This pairing works because Sigeti is both fun and reliable, which is apparently rare enough to deserve a parade. Expect stupidly good chemistry, dramatic compliments, and one eyebrow raise that ruins your week."
    ]
  },
  {
    id: 27,
    name: "Stick",
    image: "assets/matches/Stick.PNG",
    text: [
      "Stick is clever, warm, and just weird enough to make every conversation memorable. They'd absolutely flirt with you through recommendations, side comments, and one oddly specific observation that makes your stomach flip.",
      "You're matched because Stick turns connection into an art form. They make ordinary moments sparkle, and somehow even splitting fries in a parking lot would feel like relationship propaganda."
    ]
  },
  {
    id: 28,
    name: "Tate",
    image: "assets/matches/Tate.JPG",
    text: [
      "Tate has the dangerous mix of confidence and curiosity that makes you feel both challenged and adored. They ask good questions, give excellent reactions, and look at you like your opinions are somehow attractive.",
      "This match works because Tate keeps you engaged and a little unsteady. They'll flirt with dry humor, pull you closer at exactly the right time, and generally behave like they understand pacing better than most screenwriters."
    ]
  },
  {
    id: 29,
    name: "Trent",
    image: "assets/matches/Trent.JPG",
    text: [
      "Trent is graceful until they start joking, then suddenly they're hilarious in a way that catches you off guard. Elegant menace, basically. Very unfortunate for your ability to remain normal.",
      "You're paired with Trent because they blend tenderness with spark. They'll remember what matters to you, tease you when you deserve it, and kiss your forehead like it's a personal brand strategy."
    ]
  },
  {
    id: 30,
    name: "Vecino",
    image: "assets/matches/Vecino.JPG",
    text: [
      "Vecino has main-character confidence and the generosity to use it for good. They're stylish, affectionate, and perfectly aware that half their power is in the timing of a well-placed grin.",
      "This pairing works because Vecino brings excitement without turning your life into nonsense. They'd make you feel adored in public, protected in private, and slightly dizzy the entire time."
    ]
  },
  {
    id: 31,
    name: "Trevor",
    image: "assets/matches/Trevor.png",
    text: [
      "Trevor is the slow-smile, late-text, impossible-to-forget type. They're imaginative, annoyingly attractive, and way too good at making moments feel cinematic without trying too hard.",
      "You're matched because Trevor knows how to build tension and then actually deliver on it. They'll send a dangerous voice note, make eye contact like a sport, and leave you wondering how this got so flirty so fast."
    ]
  }
];

const BURNFEED_CONFIG = {
  storageKeyAnswers: "burnfeed_saved_answers_v1",
  storageKeyLogged: "burnfeed_logged_first_submit_v1",
  googleScriptUrl: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
  customJumpscareSound: "assets/ads/Ballsack3.mp3",
  popupTypeWeights: {
    default: 0.4,
    multiply: 0.3,
    jumpscare: 0.3
  }
};

const SIDE_AD_IMAGE_POOL = [
  "assets/ads/Ethan_ad.PNG",
  "assets/ads/Scrat_ad2.JPG",
  "assets/ads/Slade_gif.gif",
  "assets/ads/Goob_gif.gif",
  "assets/ads/Slade_ad2.JPG",
  "assets/ads/Free_ad.jpg",
  "assets/ads/15year_ad.jpg"
];

const CLICKABLE_SIDE_ADS = {
  "assets/ads/Free_ad.jpg": {
    modalImage: "assets/ads/Cripsy_ad.PNG",
    copy: [
      "Chris Parinella, aka CP",
      "Why the fuck did you wanna watch that??"
    ]
  },
  "assets/ads/15year_ad.jpg": {
    modalImage: "assets/ads/Goob_ad2.JPG",
    copy: [
      "Goob is literally a 15 year old",
      "He is hot tho"
    ]
  }
};

const SIDE_ADS = [
  {
    id: "left-banner",
    title: "Why did you click on this??"
  },
  {
    id: "right-banner",
    title: "Why did you click on this??"
  }
];

const POPUP_AD_IMAGE_POOL = [
  "assets/ads/Spencer_ad.JPG",
  "assets/ads/Sigeti_ad.JPG",
  "assets/ads/Scrat_ad1.PNG",
  "assets/ads/Spencer_ad2.JPG"
];

const POPUP_ADS = [
  {
    type: "default",
    title: "Singles near you",
    body: "This hottie is single and waiting to meet you"
  },
  {
    type: "default",
    title: "Doctors hate this one trick",
    body: "This guy figured out the secret to immortality. Click here to learn more"
  },
  {
    type: "multiply",
    title: "This is deadass a virus",
    body: "Stop clicking me"
  },
  {
    type: "multiply",
    title: "Your device is 95% infected",
    body: "You're making it worse"
  },
  {
    type: "jumpscare",
    title: "Jumpscare Ad",
    image: "assets/ads/Asses_ad.JPG",
    body: "Shows briefly with loud audio and vanishes before anyone can process their regret."
  }
];

Object.assign(BURNFEED_CONFIG, {
  popupIntervalMinMs: 9000,
  popupIntervalMaxMs: 22000,
  sideAdRotateMs: 10000,
  multiplyPopupRounds: 2,
  maxSimultaneousPopups: 4,
  jumpscareDurationMs: 300,
  sideAdModalLockScroll: true
});


globalThis.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
globalThis.MATCHES = MATCHES;
globalThis.BURNFEED_CONFIG = BURNFEED_CONFIG;
globalThis.SIDE_AD_IMAGE_POOL = SIDE_AD_IMAGE_POOL;
globalThis.CLICKABLE_SIDE_ADS = CLICKABLE_SIDE_ADS;
globalThis.SIDE_ADS = SIDE_ADS;
globalThis.POPUP_AD_IMAGE_POOL = POPUP_AD_IMAGE_POOL;
globalThis.POPUP_ADS = POPUP_ADS;
