function getBlogTitle(blogType: "pre-period" | "pms-care" | "hormone-balance") {
  switch (blogType) {
    case "pre-period":
      return "Pre-Period Wellness 101";
    case "pms-care":
      return "PMS Care & Comfort";
    case "hormone-balance":
      return "Hormone Balance 101";
  }
}

// todo: lazy fetch real articles from backend
const articles = [
  {
    title: "How to ease PMS Bloating Naturally",
    src: "",
    type: ["pre-period"],
  },
  {
    title: "Why Your Skin Changes Before Your Period",
    src: "",
    type: ["pre-period"],
  },
  {
    title: "How to Manage PMS Mood Swings",
    src: "",
    type: ["pre-period"],
  },
  {
    title: "How to Deal with PMS Cramps",
    src: "",
    type: ["pre-period"],
  },
  {
    title: "Why Your Period Cramps Are So Bad",
    src: "",
    type: ["pms-care"],
  },
  {
    title: "Where to Find the Best PMS Supplements",
    src: "",
    type: ["pms-care"],
  },
  {
    title: "Who even uses tampons?",
    src: "",
    type: ["pms-care"],
  },
  {
    title: "Oh my god, I'm bleeding",
    src: "",
    type: ["pms-care"],
  },
  {
    title: "Am I Normal? 10 Signs You're Not Alone",
    src: "",
    type: ["hormone-balance"],
  },
  {
    title: "How to Balance Your Hormones Naturally",
    src: "",
    type: ["hormone-balance"],
  },
  {
    title: "From Chia to Menstrual Cups: The Evolution of Period Products",
    src: "",
    type: ["hormone-balance"],
  },
  {
    title: "Whole30 for Periods: What to Know",
    src: "",
    type: ["hormone-balance"],
  },
];

export default function Blogs({
  blogType = "pre-period",
}: {
  blogType: "pre-period" | "pms-care" | "hormone-balance";
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-lg font-medium">{getBlogTitle(blogType)}</span>
      <div className="flex flex-row gap-4 overflow-x-auto pr-2 pb-2 scrollbar-hide">
        {articles
          .filter((article) =>
            article.type.includes(
              blogType as "pre-period" | "pms-care" | "hormone-balance"
            )
          )
          .map((article) => (
            <div className="flex flex-col gap-4 bg-[#F9D1CD] rounded-2xl p-4 w-full min-w-[10rem] h-full justify-center items-center">
              <div className="w-[5rem] h-[5rem] bg-white rounded-2xl" />
              <span className="text-base">{article.title}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export function FeaturedBlogs() {
  const fetchedBlogs = [
    {
      title: "Undestanding your Menstrual Cycle",
      description:
        "Get to know your body, hormones, and what happens each day of your cycle.",
      src: "",
    },
    {
      title: "Top 10 Ways to Reduce Period Pain",
      description:
        "Discover simple, effective ways to reduce period pain and improve your overall well-being.",
      src: "",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <span className="text-lg font-semibold">Featured Blogs</span>
        <button type="button" className="text-sm pr-2 text-gray-700">
          See All
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {fetchedBlogs.map((blog) => (
          <div className="flex flex-row gap-4 justify-between items-center bg-[#F9D1CD] rounded-[2rem] p-4 w-full">
            <span className="min-w-[5rem] w-[5rem] h-[5rem] bg-white rounded-2xl flex"></span>
            <div className="flex flex-col gap-2 w-full h-full">
              <span className="text-base font-semibold line-clamp-1">{blog.title}</span>
              <span className="text-xs text-gray-700">{blog.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomisedBlogs() {
  const fetchedBlogs = [
    {
      title: "Yoga Poses That Work WIth Your Period",
      description: "Stretch, relax and move in harmony with your hormones.",
      src: "",
    },
    {
      title: "The Best Foods for Your Period",
      description: "Eat your way to comfort and ease during your period.",
      src: "",
    }
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <span className="text-lg font-semibold">Customised Blogs</span>
        <button type="button" className="text-sm pr-2 text-gray-700">
          See All
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {fetchedBlogs.map((blog) => (
          <div className="flex flex-row gap-4 justify-between items-center bg-[#F9D1CD] rounded-[2rem] p-4 w-full">
            <span className="min-w-[5rem] w-[5rem] h-[5rem] bg-white rounded-2xl flex"></span>
            <div className="flex flex-col gap-2 w-full h-full">
              <span className="text-base font-semibold line-clamp-1">{blog.title}</span>
              <span className="text-xs text-gray-700">{blog.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogCategories() {
    const categories = [
        {
            title: "Menstruation FAQs",
            src: "",
        },
        {
            title: "Period Pain Relief",
            src: "",
        },
        {
            title: "Hormone Balance",
            src: "",
        },
        {
            title: "Period Tracking",
            src: "",
        },
        {
            title: "Period Health",
            src: "",
        }, 
        {
            title: "Reusable Period Products",
            src: "",
        },
        {
            title: "Period Supplements",
            src: "",
        }
    ]
  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
            <span className="text-lg font-semibold">Categories</span>
            <button type="button" className="text-sm pr-2 text-gray-700">
                See All
            </button>
        </div>
        <div className="flex flex-row gap-4 overflow-x-auto pr-2 pb-2 scrollbar-hide">
            {categories.map((category) => (
                <div className="flex flex-col gap-1 justify-between items-center bg-[#F9D1CD] rounded-2xl  p-4 w-full">
                    <span className="min-w-[5rem] w-[5rem] h-[5rem] bg-white rounded-2xl flex"></span>
                    <span className="text-sm font-medium text-center">{category.title}</span>
                </div>
            ))}
        </div>
    </div>
  );
}
