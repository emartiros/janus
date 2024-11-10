import { memo,  useState } from "react";
import TopMenu from "../layout/TopMenu";
import UsersManager from "./UsersManager";
import StreamsManager from "./StreamsManager";

const ManagerComponents = {
  users: <UsersManager />,
  streams: <StreamsManager />
};

function Manager() {
  const [selectedEntity, setSelectedEntity] = useState("users");

  return (
    <div>
      <TopMenu selectedEntity={selectedEntity} onSelectEntity={setSelectedEntity} />
      {ManagerComponents[selectedEntity] || <div></div>}
    </div>
  );
}

export default memo(Manager);
