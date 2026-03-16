const QUIZ_QUESTIONS = [
  {
    id: "q1",
    question: "Pick the date plan that feels most dangerously convincing.",
    options: [
      "Bookstore wandering with coffee in hand",
      "Rooftop drinks and questionable confidence",
      "Arcade night with intense trash talk",
      "Farmer's market flirting over peaches"
    ]
  },
  {
    id: "q2",
    question: "Which text message would absolutely get your attention?",
    options: [
      "I made a playlist for your commute.",
      "Be ready in 20. It's a surprise.",
      "I saw a dog and thought of you somehow.",
      "Need a partner in crime for tacos tonight."
    ]
  },
  {
    id: "q3",
    question: "Choose your ideal flirting style.",
    options: [
      "Dry humor and devastating eye contact",
      "Sweet compliments with suspicious precision",
      "Playful roasting with a grin",
      "Accidental hand touch and panic"
    ]
  },
  {
    id: "q4",
    question: "What kind of chaos are you secretly into?",
    options: [
      "Last-minute road trip chaos",
      "Elegant chaos with expensive candles",
      "Competitive chaos involving games",
      "Soft domestic chaos like baking at midnight"
    ]
  },
  {
    id: "q5",
    question: "Pick a love-language-adjacent behavior.",
    options: [
      "Remembering tiny details about your day",
      "Stealing your fries and buying you dessert",
      "Fixing your problems before you ask",
      "Sending memes at morally incorrect hours"
    ]
  },
  {
    id: "q6",
    question: "Which outfit energy are you drawn to?",
    options: [
      "Classic and suspiciously polished",
      "Messy hot with rolled sleeves",
      "Athletic but still flirtable",
      "Soft sweater energy"
    ]
  },
  {
    id: "q7",
    question: "What should your future person be weirdly good at?",
    options: [
      "Parallel parking",
      "Cooking without measuring",
      "Winning every party game",
      "Making awkward situations funny"
    ]
  },
  {
    id: "q8",
    question: "Pick the most romantic red flag.",
    options: [
      "They act chill but definitely wrote poetry once",
      "They say they don't want a pet and then adopt one",
      "They are too competitive at mini golf",
      "They call everyone bestie except the person they like"
    ]
  },
  {
    id: "q9",
    question: "What vibe should the first kiss have?",
    options: [
      "Rainstorm movie nonsense",
      "So much tension it becomes a public utility",
      "Laughing first, then kissing",
      "Quiet and unexpectedly soft"
    ]
  },
  {
    id: "q10",
    question: "Pick a dangerously revealing snack.",
    options: [
      "Hot fries",
      "Chocolate-covered strawberries",
      "Popcorn with too much butter",
      "A charcuterie board you pretend was casual"
    ]
  }
];

const MATCHES = [
  {
    id: 1,
    name: "Avery",
    image: "assets/matches/placeholder.svg",
    text: [
      "Avery has the kind of smile that could get away with light treason and still have you offering them a jacket. They flirt like they've been professionally trained by rom-coms and a tiny bit of arrogance.",
      "You two work because Avery makes everything feel like an event, even standing in line for coffee. They'll hype you up, steal one bite of your food, and somehow make that feel intimate instead of criminal."
    ]
  },
  {
    id: 2,
    name: "Blake",
    image: "assets/matches/placeholder.svg",
    text: [
      "Blake has dangerous forearm energy and the deeply unfair habit of remembering every little thing you say. You mention one childhood snack once, and suddenly it's waiting for you on the passenger seat.",
      "This match is giving banter, loyalty, and the exact kind of eye contact that should probably require a permit. Blake will roast you lightly, then look at you like you're the best plot twist of the year."
    ]
  },
  {
    id: 3,
    name: "Casey",
    image: "assets/matches/placeholder.svg",
    text: [
      "Casey is equal parts chaos and competence, which is a disgusting combination because it is wildly attractive. They'd forget where their keys are, then flawlessly plan a weekend trip in six minutes.",
      "You're matched because Casey keeps your life interesting without turning it into a small disaster. They flirt by making you laugh so hard you accidentally reveal your feelings. Rude, but effective."
    ]
  },
  {
    id: 4,
    name: "Dakota",
    image: "assets/matches/placeholder.svg",
    text: [
      "Dakota has calm, magnetic energy, like they know exactly what they're doing and refuse to explain it. Their version of romance is subtle, sharp, and just smug enough to keep you leaning in.",
      "This pairing works because Dakota grounds you without ever being boring. They're the type to open the car door, hand you your favorite drink, and pretend that level of charm is normal human behavior."
    ]
  },
  {
    id: 5,
    name: "Emerson",
    image: "assets/matches/placeholder.svg",
    text: [
      "Emerson looks like they were built in a lab to ruin your concentration. Soft voice, stupidly good outfits, and the social confidence of someone who knows exactly how much damage they're doing.",
      "You fit because Emerson brings sweetness with just enough menace to keep things lively. They'll flirt with a compliment, then follow it with a joke so you're never fully emotionally prepared."
    ]
  },
  {
    id: 6,
    name: "Finley",
    image: "assets/matches/placeholder.svg",
    text: [
      "Finley is the human equivalent of a late-night drive with perfect music and one conversation that changes your brain chemistry. They're warm, witty, and way too good at reading your face.",
      "This match has excellent chemistry because Finley makes you feel seen without making it weird. They'd absolutely brush hair out of your face and then act like they weren't just outrageously attractive on purpose."
    ]
  },
  {
    id: 7,
    name: "Gray",
    image: "assets/matches/placeholder.svg",
    text: [
      "Gray is cool in that effortless way that makes everyone else look like they're trying too hard. Their flirting strategy is mostly smirking, showing up, and somehow being better at everything than is polite.",
      "You're a fit because Gray likes someone who can keep up. The vibe here is equal parts tension and teamwork, with just enough mock rivalry to make every conversation feel like foreplay with better punctuation."
    ]
  },
  {
    id: 8,
    name: "Harper",
    image: "assets/matches/placeholder.svg",
    text: [
      "Harper has golden-retriever charisma in a very good jacket. They'll drag you into fun plans, make friends with strangers, and then look back for you first like the entire room was just filler content.",
      "This pairing works because Harper keeps things bright without feeling shallow. They're romantic in a surprisingly attentive way, which means flowers, forehead kisses, and at least one dramatic grocery-store dance moment."
    ]
  },
  {
    id: 9,
    name: "Indigo",
    image: "assets/matches/placeholder.svg",
    text: [
      "Indigo seems mysterious until they start laughing, then suddenly the whole act falls apart in the best way. They're sharp, observant, and carry the exact amount of emotional depth needed to be dangerous.",
      "You're matched because Indigo turns quiet moments into the main event. They'd sit beside you in complete silence, bump your knee against theirs, and somehow that would be more intimate than half the world's relationships."
    ]
  },
  {
    id: 10,
    name: "Jules",
    image: "assets/matches/placeholder.svg",
    text: [
      "Jules is a flirt disguised as a responsible person. They answer texts, make reservations, and still manage to radiate the kind of charm that makes your friends narrow their eyes suspiciously.",
      "This is a strong match because Jules gives effort without making it look performative. They'd remember your exam date, hype you up, and then celebrate afterward like your success was their favorite hobby."
    ]
  },
  {
    id: 11,
    name: "Kai",
    image: "assets/matches/placeholder.svg",
    text: [
      "Kai is built for slow-burn romance and irritating levels of physical attractiveness. They somehow make hoodies, eye contact, and asking if you got home safe feel like elite-level courtship.",
      "You're paired with Kai because they bring stability with just enough spark to keep your pulse involved. Their flirting style is protective, teasing, and one hundred percent designed to leave you staring at the wall afterward."
    ]
  },
  {
    id: 12,
    name: "Logan",
    image: "assets/matches/placeholder.svg",
    text: [
      "Logan has the energy of someone who'd carry all your bags and then make you laugh the entire walk back. They are charming in a low-maintenance, suspiciously effective way.",
      "This match works because Logan makes affection feel easy. They'll send you a terrible meme, then follow up with a genuinely thoughtful check-in, which is annoyingly compelling and frankly unfair to the rest of society."
    ]
  },
  {
    id: 13,
    name: "Morgan",
    image: "assets/matches/placeholder.svg",
    text: [
      "Morgan looks like they know a secret and you are absolutely desperate to hear it. Elegant, funny, and quietly devastating, they could ruin your sleep schedule with one grin.",
      "You're a fit because Morgan brings serious chemistry and zero dull moments. They flirt like every sentence has layers, which means you'll spend half your time laughing and the other half realizing that was definitely a double meaning."
    ]
  },
  {
    id: 14,
    name: "Noel",
    image: "assets/matches/placeholder.svg",
    text: [
      "Noel is sweet in a way that makes people underestimate them, which is convenient because then they get to be funny, clever, and absurdly charming as a surprise attack.",
      "This pairing has peak comfort-meets-spark energy. Noel will make your favorite snack appear out of nowhere, call you out when you're being dramatic, and still look at you like you're the prettiest inconvenience in the room."
    ]
  },
  {
    id: 15,
    name: "Oakley",
    image: "assets/matches/placeholder.svg",
    text: [
      "Oakley has outdoorsy competence with indoor cuddle potential, a combination civilization is not prepared for. They can fix a tire, make a fire, and still flirt like a menace over brunch.",
      "You two work because Oakley balances adventure with softness. They'll drag you into a ridiculous plan, then hand you a blanket and a snack like they personally intend to keep your nervous system regulated."
    ]
  },
  {
    id: 16,
    name: "Parker",
    image: "assets/matches/placeholder.svg",
    text: [
      "Parker is the one your friends clock immediately because their face says trouble and their behavior says husband material. That kind of contradiction is catnip for the human brain apparently.",
      "This match hits because Parker is playful without being flaky. Expect top-tier banter, arm-around-the-shoulder energy, and a level of attention that makes mediocre dating options look even more embarrassing than usual."
    ]
  },
  {
    id: 17,
    name: "Quinn",
    image: "assets/matches/placeholder.svg",
    text: [
      "Quinn has a clean laugh, excellent timing, and just enough nerve to flirt in public without combusting. Their confidence is attractive because it's grounded, not because they're auditioning for a cologne ad.",
      "You're matched because Quinn would absolutely become your favorite person to debrief life with. They make everyday routines feel intimate, which is dangerous, because now even errands will have chemistry."
    ]
  },
  {
    id: 18,
    name: "Reese",
    image: "assets/matches/placeholder.svg",
    text: [
      "Reese is witty, stylish, and alarmingly good at saying exactly the thing that gets under your skin in a fun way. They flirt like a challenge and kiss like a reward, allegedly.",
      "This pairing works because Reese keeps your attention without draining your peace. They know when to stir things up, when to soften, and when to hand you food before your mood becomes a public issue."
    ]
  },
  {
    id: 19,
    name: "Riley",
    image: "assets/matches/placeholder.svg",
    text: [
      "Riley is the sort of person who makes everyone feel comfortable, then quietly turns around and absolutely wrecks one specific person's emotional stability. Congratulations, that person is probably you.",
      "You're a fit because Riley mixes gentleness with just enough flirtatious menace. They'll check in on your day, walk on the outside of the sidewalk, and then grin at you like they know exactly what that's doing."
    ]
  },
  {
    id: 20,
    name: "Rowan",
    image: "assets/matches/placeholder.svg",
    text: [
      "Rowan has the moody, cinematic vibe people pretend they don't fall for and then absolutely do. Great hair, suspiciously good playlists, and a stare that should come with a warning label.",
      "This match works because Rowan is all depth and payoff. They may look intense, but under that dramatic packaging is someone loyal, funny, and weirdly thrilled to make your life easier in small beautiful ways."
    ]
  },
  {
    id: 21,
    name: "Sage",
    image: "assets/matches/placeholder.svg",
    text: [
      "Sage is charming without being loud about it, which somehow makes it hit harder. They listen closely, speak carefully, and then blindside you by being funnier than half the room.",
      "You're paired with Sage because they bring balance to the nonsense. They have major hand-on-lower-back energy, elite taste in date ideas, and the exact right amount of emotional intelligence to be completely lethal."
    ]
  },
  {
    id: 22,
    name: "Sawyer",
    image: "assets/matches/placeholder.svg",
    text: [
      "Sawyer has chaotic flirt energy but organized life skills, which is exactly the kind of contradiction that gets people emotionally attached in record time. It's embarrassing, but there it is.",
      "This pairing works because Sawyer keeps things playful while still showing up. They'll challenge you to ridiculous games, let you win once out of mercy, and then kiss you like they were planning that all along."
    ]
  },
  {
    id: 23,
    name: "Shiloh",
    image: "assets/matches/placeholder.svg",
    text: [
      "Shiloh has quiet confidence and the kind of smile that makes rooms seem smaller. They're patient, observant, and very good at creating the illusion that you are the only person worth paying attention to.",
      "You're matched because Shiloh is the soft-spoken problem your love life deserves. Expect thoughtful dates, subtle flirting, and a voice note that somehow turns your entire evening into a daydream."
    ]
  },
  {
    id: 24,
    name: "Skyler",
    image: "assets/matches/placeholder.svg",
    text: [
      "Skyler is pure magnetism with a side of nonsense. They look expensive, laugh loudly, and carry themselves like someone who knows life is short and chemistry should be entertaining.",
      "This match works because Skyler makes bold feel safe. They'll tell you you're gorgeous like it's an objective fact, then drag you into a chaotic memory you'll both pretend happened naturally."
    ]
  },
  {
    id: 25,
    name: "Tatum",
    image: "assets/matches/placeholder.svg",
    text: [
      "Tatum is a little bit smug and completely justified about it. They're competent, affectionate, and very likely to text you something mildly flirty right when you were trying to be productive.",
      "You're a match because Tatum thrives on chemistry with substance. They'll make you laugh, make you feel wanted, and make your standards rise enough to inconvenience future alternatives."
    ]
  },
  {
    id: 26,
    name: "Val",
    image: "assets/matches/placeholder.svg",
    text: [
      "Val has romantic menace in the best possible way. Their whole thing is acting casual while doing devastatingly attentive things like handing you your favorite drink without asking.",
      "This pairing works because Val is both fun and reliable, which is apparently rare enough to deserve a parade. Expect stupidly good chemistry, dramatic compliments, and one eyebrow raise that ruins your week."
    ]
  },
  {
    id: 27,
    name: "Wren",
    image: "assets/matches/placeholder.svg",
    text: [
      "Wren is clever, warm, and just weird enough to make every conversation memorable. They'd absolutely flirt with you through recommendations, side comments, and one oddly specific observation that makes your stomach flip.",
      "You're matched because Wren turns connection into an art form. They make ordinary moments sparkle, and somehow even splitting fries in a parking lot would feel like relationship propaganda."
    ]
  },
  {
    id: 28,
    name: "Xan",
    image: "assets/matches/placeholder.svg",
    text: [
      "Xan has the dangerous mix of confidence and curiosity that makes you feel both challenged and adored. They ask good questions, give excellent reactions, and look at you like your opinions are somehow attractive.",
      "This match works because Xan keeps you engaged and a little unsteady. They'll flirt with dry humor, pull you closer at exactly the right time, and generally behave like they understand pacing better than most screenwriters."
    ]
  },
  {
    id: 29,
    name: "Yael",
    image: "assets/matches/placeholder.svg",
    text: [
      "Yael is graceful until they start joking, then suddenly they're hilarious in a way that catches you off guard. Elegant menace, basically. Very unfortunate for your ability to remain normal.",
      "You're paired with Yael because they blend tenderness with spark. They'll remember what matters to you, tease you when you deserve it, and kiss your forehead like it's a personal brand strategy."
    ]
  },
  {
    id: 30,
    name: "Zuri",
    image: "assets/matches/placeholder.svg",
    text: [
      "Zuri has main-character confidence and the generosity to use it for good. They're stylish, affectionate, and perfectly aware that half their power is in the timing of a well-placed grin.",
      "This pairing works because Zuri brings excitement without turning your life into nonsense. They'd make you feel adored in public, protected in private, and slightly dizzy the entire time."
    ]
  },
  {
    id: 31,
    name: "Nova",
    image: "assets/matches/placeholder.svg",
    text: [
      "Nova is the slow-smile, late-text, impossible-to-forget type. They're imaginative, annoyingly attractive, and way too good at making moments feel cinematic without trying too hard.",
      "You're matched because Nova knows how to build tension and then actually deliver on it. They'll send a dangerous voice note, make eye contact like a sport, and leave you wondering how this got so flirty so fast."
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

const SIDE_ADS = [
  {
    id: "left-banner",
    title: "This Could Have Been A Nice Website",
    thumbs: [
      "assets/ads/side-ad-1.svg",
      "assets/ads/side-ad-3.svg",
      "assets/ads/side-ad-2.svg"
    ],
    modalImage: "assets/ads/ad-popup.svg",
    copy: [
      "This is the expanded version of the left-side ad. Replace the image here with whatever fake sponsor or cursed graphic you want.",
      "The user must close this before getting back to the quiz, which is an elegant way to disrespect their attention span."
    ]
  },
  {
    id: "right-banner",
    title: "Premium Distraction Experience",
    thumbs: [
      "assets/ads/side-ad-2.svg",
      "assets/ads/side-ad-4.svg",
      "assets/ads/side-ad-1.svg"
    ],
    modalImage: "assets/ads/ad-popup.svg",
    copy: [
      "This is the expanded version of the right-side ad. Swap in your own image later to make the interruption feel truly personal.",
      "It exists for the noble purpose of making a simple quiz feel like crossing a highway in flip-flops."
    ]
  }
];

const POPUP_ADS = [
  {
    type: "default",
    title: "Singles Near Literally Anywhere",
    image: "assets/ads/ad-popup.svg",
    body: "A normal popup ad. The user can close it like a reasonable nuisance."
  },
  {
    type: "default",
    title: "Doctors Hate This Quiz",
    image: "assets/ads/ad-popup.svg",
    body: "Another plain popup, because repetition is the soul of bad design."
  },
  {
    type: "multiply",
    title: "Congratulations, You Clicked Nothing",
    image: "assets/ads/ad-popup.svg",
    body: "Closing this ad creates two more. It is inspired by malware and the human condition."
  },
  {
    type: "multiply",
    title: "Your Device Is Probably Fine",
    image: "assets/ads/ad-popup.svg",
    body: "Every close button is merely a suggestion. Two fresh popups will rise from its ashes."
  },
  {
    type: "jumpscare",
    title: "Jumpscare Ad",
    image: "assets/ads/jumpscare.svg",
    body: "Shows briefly with loud audio and vanishes before anyone can process their regret."
  }
];

Object.assign(BURNFEED_CONFIG, {
  popupIntervalMinMs: 5000,
  popupIntervalMaxMs: 15000,
  sideAdRotateMs: 10000,
  multiplyPopupRounds: 2,
  maxSimultaneousPopups: 4,
  jumpscareDurationMs: 300,
  sideAdModalLockScroll: true
});
