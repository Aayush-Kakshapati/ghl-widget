import ListLayout from "./announcement/layouts/ListLayout";
import GridLayout from "./announcement/layouts/GridLayout";
import SmallCarouselLayout from "./announcement/layouts/SmallCarouselLayout";
import CarouselLayout from "./announcement/layouts/CarouselLayout";
import FullCarouselLayout from "./announcement/layouts/FullCarouselLayout";

export const widgetRegistry = {
  announcement: {
    name: "Announcement Banner",

    layouts: {
      list: {
        name: "List",
        component: ListLayout,
      },

      grid: {
        name: "Grid",
        component: GridLayout,
      },

      "small-carousel": {
        name: "Small Carousel",
        component: SmallCarouselLayout,
      },

      carousel: {
        name: "Normal Carousel",
        component: CarouselLayout,
      },

      "full-carousel": {
        name: "Full Carousel",
        component: FullCarouselLayout,
      },
    },
  },

  // price: {
  //   name: "Price Widget",
  //   layouts: { ... }
  // },
};
