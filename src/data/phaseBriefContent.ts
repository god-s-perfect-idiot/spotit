export type PhaseBriefBullet = { label: string; text: string };

export type PhaseBriefSection = {
  title: string;
  bullets?: PhaseBriefBullet[];
  paragraph?: string;
};

export type PhaseBriefContent = {
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  sections: PhaseBriefSection[];
  cardGradient: { from: string; to: string };
};

const MENSTRUATION: PhaseBriefContent = {
  heroTitle: "Menstruation",
  heroSubtitle: "Your period phase",
  intro:
    "Menstruation is when your uterus sheds its lining. Bleeding is the visible part of this reset: your hormones are at a low ebb and your body is starting a fresh cycle.",
  cardGradient: { from: "#FFE4E4", to: "#FFFFFF" },
  sections: [
    {
      title: "What's Happening Inside?",
      bullets: [
        {
          label: "Hormone Dip",
          text: "Estrogen and progesterone drop after the previous cycle, signaling the lining to shed.",
        },
        {
          label: "The Shedding",
          text: "Blood and tissue from the uterine lining leave the body—this is your period.",
        },
        {
          label: "The Reset",
          text: "Most bleeding lasts a few days to a week; the ovaries begin preparing new follicles.",
        },
      ],
    },
    {
      title: "How You Might Feel",
      bullets: [
        {
          label: "Lower Energy",
          text: "Rest is normal; cramps, back tension, or fatigue are common.",
        },
        {
          label: "Mood Shifts",
          text: "Some people feel irritable or low; others feel relief once bleeding starts.",
        },
        {
          label: "Cramping",
          text: "Prostaglandins can trigger uterine cramps—heat packs and gentle movement often help.",
        },
        {
          label: "Hunger & Cravings",
          text: "Appetite changes are typical—prioritize iron-rich foods if you need a boost.",
        },
      ],
    },
    {
      title: "Quick Tip",
      paragraph:
        "Track flow and symptoms so patterns are easier to spot over time. Seek care if bleeding is much heavier or more painful than your usual baseline.",
    },
  ],
};

const FOLLICULAR: PhaseBriefContent = {
  heroTitle: "Rising Energy",
  heroSubtitle: "Follicular phase",
  intro:
    "After your period, the follicular phase is a stretch of rebuilding. Estrogen climbs as follicles mature in the ovaries, and many people feel a gradual lift in mood and stamina.",
  cardGradient: { from: "#FFE8EC", to: "#FFFFFF" },
  sections: [
    {
      title: "What's Happening Inside?",
      bullets: [
        {
          label: "Follicle Growth",
          text: "Several follicles develop; usually one becomes dominant.",
        },
        {
          label: "Estrogen Rise",
          text: "Rising estrogen helps thicken the uterine lining again.",
        },
        {
          label: "LH Stays Low",
          text: "Luteinizing hormone is relatively quiet until just before ovulation.",
        },
      ],
    },
    {
      title: "How You Might Feel",
      bullets: [
        {
          label: "More Energy",
          text: "Many people feel clearer, more motivated, and more social.",
        },
        {
          label: "Skin & Hair",
          text: "Some notice a brighter complexion as hormones shift.",
        },
        {
          label: "Discharge",
          text: "Cervical mucus often increases and may turn wetter as ovulation nears.",
        },
        {
          label: "Libido",
          text: "Sex drive may ramp up toward the fertile window.",
        },
      ],
    },
    {
      title: "Quick Tip",
      paragraph:
        "This is a great time for harder workouts or big projects if your body feels up for it—still honor rest when you need it.",
    },
  ],
};

const OVULATION: PhaseBriefContent = {
  heroTitle: "Fertile Window",
  heroSubtitle: "Ovulation phase",
  intro:
    "Ovulation is the main event of your cycle. It is the brief window when a mature egg is released from the ovary, making it the only time conception can occur.",
  cardGradient: { from: "#FFF9E0", to: "#FFFFFF" },
  sections: [
    {
      title: "What's Happening Inside?",
      bullets: [
        {
          label: "Hormonal Peak",
          text: "Estrogen reaches its highest point, triggering a sudden spike in Luteinizing Hormone (LH).",
        },
        {
          label: "The Release",
          text: "This LH surge signals the ovary to release an egg into the fallopian tube.",
        },
        {
          label: "The Window",
          text: "The egg survives for 12–24 hours. If it isn't fertilized, it dissolves, and your hormone levels drop to prepare for the next phase.",
        },
      ],
    },
    {
      title: "How You Might Feel",
      bullets: [
        {
          label: "Energy High",
          text: "You may feel more energetic, social, and confident than usual.",
        },
        {
          label: "Increased Libido",
          text: "It is common to experience a higher sex drive during this window.",
        },
        {
          label: "Discharge Changes",
          text: "Look for cervical mucus that feels wet, slippery, and stretchy (like raw egg whites). This helps sperm travel to the egg.",
        },
        {
          label: "Mild Cramping",
          text: "Some people feel a brief twinge or pinch on one side of the lower abdomen (known as mittelschmerz).",
        },
      ],
    },
    {
      title: "Quick Tip",
      paragraph:
        "A slight rise in your Basal Body Temperature (BBT) happens after ovulation is over. To predict your fertile window in real-time, track cervical mucus or use LH strips instead.",
    },
  ],
};

const LUTEAL: PhaseBriefContent = {
  heroTitle: "Wind-Down",
  heroSubtitle: "Luteal phase",
  intro:
    "The luteal phase begins after ovulation. The ruptured follicle becomes the corpus luteum and releases progesterone, which stabilizes the lining—whether or not a pregnancy occurs, this phase sets the stage for your next period or pregnancy.",
  cardGradient: { from: "#FFE8DE", to: "#FFFFFF" },
  sections: [
    {
      title: "What's Happening Inside?",
      bullets: [
        {
          label: "Progesterone Rise",
          text: "Progesterone dominates, keeping the uterine lining thick and supportive.",
        },
        {
          label: "Stable Then Shifting",
          text: "If no implantation occurs, the corpus luteum fades and hormone levels fall.",
        },
        {
          label: "Pre-Menstrual Signal",
          text: "That drop often triggers your next period within about two weeks of ovulation.",
        },
      ],
    },
    {
      title: "How You Might Feel",
      bullets: [
        {
          label: "PMS Possibilities",
          text: "Bloating, breast tenderness, mood changes, or food cravings can show up.",
        },
        {
          label: "Sleep & Focus",
          text: "Some people sleep more lightly or feel a bit foggy in the second half.",
        },
        {
          label: "Energy Dip",
          text: "Motivation may ease off—lighter workloads or gentler exercise can feel better.",
        },
        {
          label: "Temperature",
          text: "Basal body temperature often stays slightly higher until your period starts.",
        },
      ],
    },
    {
      title: "Quick Tip",
      paragraph:
        "Patterns matter more than any one symptom. If premenstrual discomfort disrupts daily life every cycle, consider discussing options with a healthcare provider.",
    },
  ],
};

export const PHASE_BRIEF_BY_NAME: Record<string, PhaseBriefContent> = {
  Menstruation: MENSTRUATION,
  "Follicular Phase": FOLLICULAR,
  Ovulation: OVULATION,
  "Luteal Phase": LUTEAL,
};

export function getPhaseBriefContent(phaseName: string): PhaseBriefContent {
  return PHASE_BRIEF_BY_NAME[phaseName] ?? OVULATION;
}
