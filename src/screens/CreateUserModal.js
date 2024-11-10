import { useEffect, useRef, useState } from "react";
import { bootstrap } from "..";
import { iam } from "../aws";

function CreateUserModal({userUpdater}) {
  const [username, setUsername] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    modalRef.current = new bootstrap.Modal("#createUserModal", { });
  }, []);

  const handleSubmit = (e) => {
    iam.createUser({UserName: username}, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        setUsername("");
        modalRef.current.hide();
        userUpdater()
      }
    })
  };

  return (
    <div>
    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createUserModal">
      Create a user
    </button>
    <div
      className="modal fade"
      id="createUserModal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createUserModalLabel">
              Create User
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="usernameInput"
                value={username}
                style={{ marginBottom: 16 }}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default CreateUserModal;
