// Project images for Residential Harmony
import rh_image1 from "../../public/projects/residential-harmony/rh-living-1.webp";
import rh_image2 from "../../public/projects/residential-harmony/rh-living-2.webp";
import rh_image3 from "../../public/projects/residential-harmony/rh-living-3.webp";
import rh_image4 from "../../public/projects/residential-harmony/rh-kitchen-1.webp";
import rh_image5 from "../../public/projects/residential-harmony/rh-kitchen-2.webp";
import rh_image6 from "../../public/projects/residential-harmony/rh-kitchen-3.webp";
import rh_image7 from "../../public/projects/residential-harmony/rh-kitchen-4.webp";
import rh_image8 from "../../public/projects/residential-harmony/rh-kitchen-5.webp";
import rh_image9 from "../../public/projects/residential-harmony/rh-kitchen-6.webp";
import rh_image11 from "../../public/projects/residential-harmony/rh-balcony-1.webp";
import rh_image12 from "../../public/projects/residential-harmony/rh-balcony-2.webp";
import rh_image13 from "../../public/projects/residential-harmony/rh-balcony-3.webp";
import rh_image14 from "../../public/projects/residential-harmony/rh-balcony-4.webp";
import rh_image15 from "../../public/projects/residential-harmony/rh-balcony-5.webp";
import rh_image16 from "../../public/projects/residential-harmony/rh-bedroom-1.webp";
import rh_image17 from "../../public/projects/residential-harmony/rh-bedroom-2.webp";
import rh_image18 from "../../public/projects/residential-harmony/rh-bedroom-3.webp";
import rh_image19 from "../../public/projects/residential-harmony/rh-bedroom-4.webp";
import rh_image20 from "../../public/projects/residential-harmony/rh-bedroom-5.webp";
import rh_image21 from "../../public/projects/residential-harmony/rh-bedroom-6.webp";

// Project images for Personal Banker
import pb_image1 from "../../public/projects/personal-banker-app/pb-1.png";
import pb_image2 from "../../public/projects/personal-banker-app/pb-2.png";
import pb_image3 from "../../public/projects/personal-banker-app/pb-3.png";
import pb_image4 from "../../public/projects/personal-banker-app/pb-4.png";
import pb_image5 from "../../public/projects/personal-banker-app/pb-5.png";
import pb_image6 from "../../public/projects/personal-banker-app/pb-6.png";
import pb_image7 from "../../public/projects/personal-banker-app/pb-7.png";
import pb_image8 from "../../public/projects/personal-banker-app/pb-8.png";

// Project images for AI Journalist: 1TV Moldova
import aj_image1 from "../../public/projects/ai-journalist-1tv/aj-1.png";
import aj_image2 from "../../public/projects/ai-journalist-1tv/aj-2.png";
import aj_image3 from "../../public/projects/ai-journalist-1tv/aj-3.png";
import aj_image4 from "../../public/projects/ai-journalist-1tv/aj-4.png";
import aj_image5 from "../../public/projects/ai-journalist-1tv/aj-5.png";

export type ProjectData = {
  id: number;
  name: string;
  slug: string;
  thumbnail: any;
  url?: string;
  gallery: {
    images: Array<{
      src: any;
      original: any;
      width: number;
      height: number;
      alt: string;
    }>;
  };
};

export const projectsData: ProjectData[] = [
  {
    id: 1,
    name: "AI Journalist: 1TV Moldova",
    slug: "ai-journalist-1tv",
    thumbnail: aj_image1,
    gallery: {
      images: [
        {
          src: aj_image1,
          original: aj_image1,
          width: 1920,
          height: 1080,
          alt: "AI Journalist: 1TV Moldova - Dashboard",
        },
        {
          src: aj_image2,
          original: aj_image2,
          width: 1920,
          height: 1080,
          alt: "AI Journalist: 1TV Moldova - Workflow",
        },
        {
          src: aj_image3,
          original: aj_image3,
          width: 1920,
          height: 1080,
          alt: "AI Journalist: 1TV Moldova - Data Extraction",
        },
        {
          src: aj_image4,
          original: aj_image4,
          width: 1920,
          height: 1080,
          alt: "AI Journalist: 1TV Moldova - Process View",
        },
        {
          src: aj_image5,
          original: aj_image5,
          width: 1920,
          height: 1080,
          alt: "AI Journalist: 1TV Moldova - Finished Product",
        },
      ],
    },
  },
  {
    id: 2,
    name: "Personal Banker Dashboard",
    slug: "personal-banker-app",
    thumbnail: pb_image1,
    gallery: {
      images: [
        {
          src: pb_image1,
          original: pb_image1,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Overview",
        },
        {
          src: pb_image2,
          original: pb_image2,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Transactions",
        },
        {
          src: pb_image3,
          original: pb_image3,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Analytics",
        },
        {
          src: pb_image4,
          original: pb_image4,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Project Details",
        },
        {
          src: pb_image5,
          original: pb_image5,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Settings",
        },
        {
          src: pb_image6,
          original: pb_image6,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Mobile View",
        },
        {
          src: pb_image7,
          original: pb_image7,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - Dark Mode",
        },
        {
          src: pb_image8,
          original: pb_image8,
          width: 1920,
          height: 1080,
          alt: "Personal Banker Dashboard - AI Orchestration",
        },
      ],
    },
  },
  {
    id: 3,
    name: "Residential Harmony",
    slug: "residential-harmony",
    thumbnail: rh_image1,
    gallery: {
      images: [
        {
          src: rh_image1,
          original: rh_image1,
          width: 1080,
          height: 720,
          alt: "Residential Harmony living area view 1",
        },
        {
          src: rh_image2,
          original: rh_image2,
          width: 1080,
          height: 720,
          alt: "Residential Harmony living area view 2",
        },
        {
          src: rh_image3,
          original: rh_image3,
          width: 1080,
          height: 720,
          alt: "Residential Harmony living area view 3",
        },
        {
          src: rh_image4,
          original: rh_image4,
          width: 1080,
          height: 720,
          alt: "Residential Harmony kitchen view 1",
        },
        {
          src: rh_image5,
          original: rh_image5,
          width: 1080,
          height: 720,
          alt: "Residential Harmony kitchen view 2",
        },
        {
          src: rh_image6,
          original: rh_image6,
          width: 1080,
          height: 720,
          alt: "Residential Harmony kitchen view 3",
        },
        {
          src: rh_image7,
          original: rh_image7,
          width: 1080,
          height: 720,
          alt: "Residential Harmony kitchen view 4",
        },
        {
          src: rh_image8,
          original: rh_image8,
          width: 1080,
          height: 720,
          alt: "Residential Harmony kitchen view 5",
        },
        {
          src: rh_image9,
          original: rh_image9,
          width: 1080,
          height: 720,
          alt: "Residential Harmony kitchen view 6",
        },
        {
          src: rh_image11,
          original: rh_image11,
          width: 1080,
          height: 720,
          alt: "Residential Harmony balcony view 1",
        },
        {
          src: rh_image12,
          original: rh_image12,
          width: 1080,
          height: 720,
          alt: "Residential Harmony balcony view 2",
        },
        {
          src: rh_image13,
          original: rh_image13,
          width: 1080,
          height: 720,
          alt: "Residential Harmony balcony view 3",
        },
        {
          src: rh_image14,
          original: rh_image14,
          width: 1080,
          height: 720,
          alt: "Residential Harmony balcony view 4",
        },
        {
          src: rh_image15,
          original: rh_image15,
          width: 1080,
          height: 720,
          alt: "Residential Harmony balcony view 5",
        },
        {
          src: rh_image16,
          original: rh_image16,
          width: 1080,
          height: 720,
          alt: "Residential Harmony bedroom view 1",
        },
        {
          src: rh_image17,
          original: rh_image17,
          width: 1080,
          height: 720,
          alt: "Residential Harmony bedroom view 2",
        },
        {
          src: rh_image18,
          original: rh_image18,
          width: 1080,
          height: 720,
          alt: "Residential Harmony bedroom view 3",
        },
        {
          src: rh_image19,
          original: rh_image19,
          width: 1080,
          height: 720,
          alt: "Residential Harmony bedroom view 4",
        },
        {
          src: rh_image20,
          original: rh_image20,
          width: 1080,
          height: 720,
          alt: "Residential Harmony bedroom view 5",
        },
        {
          src: rh_image21,
          original: rh_image21,
          width: 1080,
          height: 720,
          alt: "Residential Harmony bedroom view 6",
        },
      ],
    },
  },
];

// Helper functions

export const getProjectBySlug = (slug: string) => {
  return projectsData.find((project) => project.slug === slug);
};
export const getAllProjectSlugs = () => {
  return projectsData.map((project) => project.slug);
};
