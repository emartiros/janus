import { memo, useEffect, useState } from "react";
import { iam } from "../aws";
import ScrollableList from "../components/ScrollableList/ScrollableList";
import CreateUserModal from "./CreateUserModal";
import ManageUserModal from "./ManageUserModal";

function UsersManager() {
  const [users, setUsers] = useState();
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    updateUsers();
  }, []);

  const updateUsers = () => {
    iam.listUsers({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        setUsers(data.Users.filter((u) => u.UserName !== "janus"));
      }
    });
  };

  const deletePolicies = (user, then) => {
    iam.listUserPolicies( { UserName: user.UserName }, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        const deletePromises = data.PolicyNames.map(policyName =>
          new Promise((resolve, reject) => {
            iam.deleteUserPolicy({ UserName: user.UserName, PolicyName: policyName }, (err, data) => {
              if (err) {
                console.error(`Failed to delete policy ${policyName}:`, err);
                reject(err);
              } else {
                resolve();
              }
            });
          })
        );
        Promise.all(deletePromises).then(() => {
          console.log("All policies deleted.");
          then();
        })
      }
    })
  }

  const deleteAccessKeys = (user, then) => {
    iam.listAccessKeys({ UserName: user.UserName }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        if (data.AccessKeyMetadata.length === 0) {
          then(user)
        }
        let size = data.AccessKeyMetadata.length;
        data.AccessKeyMetadata.forEach((a) =>
          iam.deleteAccessKey({ UserName: user.UserName, AccessKeyId: a.AccessKeyId }, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              size -= 1;
              if (size === 0) {
                then(user)
              }
            }
          })
        );
      }
    });
  }

  const deleteIam = (user) => {
    iam.deleteUser({ UserName: user.UserName }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        updateUsers();
      }
    });
  }

  const deleteUser = (user) => {
    deleteAccessKeys(user, 
      () => deletePolicies(user,
        () => deleteIam(user)
      ))
  };

  const renderUser = (user) => {
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 16 }}>
        <span style={{ cursor: "pointer" }} onClick={() => setSelectedUser(user)}>
          {user.UserName}
        </span>
        <button className="btn btn-danger" onClick={() => deleteUser(user)}>
          Delete
        </button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <CreateUserModal userUpdater={updateUsers} />
      </div>
      <ManageUserModal user={selectedUser} hideModal={() => setSelectedUser(null)} />
      <ScrollableList items={users?.map((u) => renderUser(u))} />
    </div>
  );
}

export default memo(UsersManager, () => true);
