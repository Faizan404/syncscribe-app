import { useOthers, useSelf } from "@liveblocks/react";
import { useState } from "react";

function Avatars() {
  const others = useOthers();
  const self = useSelf();

  const [tooltip, setTooltip] = useState(false);

  const users = [self, ...others];

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-500">User currently editing this page</p>
      <div className="avatar-group -space-x-6 rtl:space-x-reverse">
        {users.map((user) => (
          <div
            className={`tooltip tooltip-open tooltip-bottom cursor-pointer`}
            data-tip="hello"
            key={user?.info?.avatar}
          >
            <div
              className="avatar"
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
            >
              <div className="w-8">
                <img src={user?.info?.avatar} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Avatars;
