export default function CycleGuides() {

    const guides = [
        {
            title: "Nutrition",
            src: "",
        }, {
            title: "Workout",
            src: "",
        }, {
            title: "Skin care",
            src: "",
        }, {
            title: "Mental Health",
            src: "",
        }, {
            title: "Sexual Health",
            src: "",
        }, {
            title: "Medication",
            src: "",
        }, {
            title: "Mindfulness",
            src: "",
        }, 
    ]

  return <div className="flex flex-col gap-2">
    <span className="text-lg font-medium">Today's Cycle Guide</span>
    <div className="flex flex-row gap-4">
      <div className="flex flex-row gap-4 overflow-x-auto pr-2 pb-2 scrollbar-hide">
        {guides.map((guide) => (
            <div className="flex flex-col gap-2 justify-center items-center">
                <div className="w-[6rem] h-[6rem] bg-white rounded-2xl"/>
                <span className="text-sm text-center">{guide.title}</span>
            </div>
        ))}
      </div>
    </div>
  </div>;
}