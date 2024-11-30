import { useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { doc } from "firebase/firestore";
import { NavLink } from "react-router-dom";

function SideBarDocOptions({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));

  if (!data) return null;

  return (
    <NavLink
      to={`/doc/${id}`}
      className={({ isActive }) =>
        isActive
          ? "btn btn-neutral w-full"
          : "btn btn-outline w-full"
      }
    >
      <li>{data.title}</li>
    </NavLink>
  );
}
export default SideBarDocOptions;
