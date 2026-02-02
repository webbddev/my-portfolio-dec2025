import React from "react";

const PortfolioGrid_v2 = () => {
  const categories = [
    "Applications",
    "Branding",
    "Graphic Design",
    "Photography",
    "Promotion",
  ];

  const projects = [
    {
      title: "Virtual Reality",
      date: "January 10, 2023",
      image:
        "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Urban Landscapes",
      date: "December 28, 2022",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Emma Johnson",
      date: "November 20, 2022",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Yoga App",
      date: "September 5, 2022",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-1 md:row-span-2",
    },
    {
      title: "Tech Innovations",
      date: "October 19, 2022",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      title: "Echo Music Festival",
      date: "November 28, 2022",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      title: "Augmented Reality",
      date: "September 3, 2022",
      image:
        "https://images.unsplash.com/photo-1592477381039-2c9bd49e0004?auto=format&fit=crop&q=80&w=800",
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 font-sans">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Experience Our Excellence
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          A portfolio that highlights our dedication to innovation, quality, and
          meaningful solutions.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-6 mb-12 border-b border-gray-100 pb-2">
        {categories.map((cat, index) => (
          <button
            key={cat}
            className={`text-sm font-semibold pb-2 transition-colors ${
              index === 0
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-3xl bg-gray-200 ${project.className}`}
          >
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <p className="text-white/70 text-xs font-medium mb-1">
                {project.date}
              </p>
              <h3 className="text-white text-xl font-bold">{project.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioGrid_v2;
