import ListLayout from "./announcement/layouts/ListLayout";
import GridLayout from "./announcement/layouts/GridLayout";
import CarouselLayout from "./announcement/layouts/CarouselLayout";

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

      carousel: {
        name: "Carousel",
        component: CarouselLayout,
      },
    },
  },

  // price: {
  //   name: "Price Widget",
  //   layouts: { ... }
  // },
};
