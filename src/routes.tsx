import { useRoutes } from "react-router-dom";
import Comics from "./pages/Comics/Comics";
import Favorite from "./pages/Favorite/Favorite";
import ComicDetails from "./pages/ComicDetails/ComicDetails";

const Routes = () => {
  const routes = useRoutes([
    { path: "/", element: <Comics /> },
    { path: "/comics", element: <Comics /> },
    { path: "/favorite", element: <Favorite /> },
    { path: "/comic/:id", element: <ComicDetails /> },
  ]);

  return routes;
};

export default Routes;