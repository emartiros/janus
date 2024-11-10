import { memo, useEffect, useState } from "react";
import { iam } from "../aws";
import ScrollableList from "../components/ScrollableList/ScrollableList";
import CreateUserModal from "./CreateUserModal";
import ManageUserModal from "./ManageUserModal";

function UsersManager() {
  const [users, setUsers] = useState();
  const [selectedUser, setSelectedUser] = useState()

  useEffect(() => {
    updateUsers()
  }, []);

  const updateUsers = () => {
    iam.listUsers({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        setUsers(data.Users.filter(u => u.UserName !== 'janus'));
      }
    });
  }

  const deleteUser = (user) => {
    iam.deleteUser({UserName: user.UserName}, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        updateUsers()
      }
    })
  }

  const renderUser = (user) => {

    return (
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 16}}>
        <span style={{cursor: 'pointer'}} onClick={() => setSelectedUser(user)}>{user.UserName}</span>
        <button className="btn btn-danger" onClick={() => deleteUser(user)}>Delete</button>
      </div>
    )
  }

  return (
    <div>
      <div>
        <CreateUserModal userUpdater={updateUsers}/>
      </div>
      <ManageUserModal user={selectedUser} hideModal={() => setSelectedUser(null)}/>
      <ScrollableList items={users?.map((u) => renderUser(u))} />
    
    </div>
  );
}

export default memo(UsersManager, () => true);
