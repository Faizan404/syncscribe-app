import { NavLink, useLocation } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();
  const host = window.location.origin;

  if (location.pathname === "/") return null;
  
  const pathList = location.pathname.split("/");

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {pathList.map((path, index) => {
          return (
            <li key={index}>
              <NavLink
                to={
                  index === 0
                    ? `${path}`
                    : `${host}${pathList
                        .slice(0, index + 1)
                        .join(",")
                        .replace(/,/g, "/")}`
                }
              >
                {!index ? "home" : path.toLowerCase()}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Breadcrumbs;
