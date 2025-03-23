export interface Comic {
    id: number;
    title: string;
    thumbnail: string;
    description: string;
  }
  
  export const comics: Comic[] = [
    {
      id: 1,
      title: "Comic 1",
      thumbnail: "https://via.placeholder.com/150",
      description: "This is the first comic.",  
    },
    {
      id: 2,
      title: "Comic 2",
      thumbnail: "https://via.placeholder.com/150",
      description: "This is the second comic.",
    },
    {
      id: 3,
      title: "Comic 3",
      thumbnail: "https://via.placeholder.com/150",
      description: "This is the third comic.",
    },
  ];