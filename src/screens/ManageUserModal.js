import { memo, useEffect, useRef, useState } from "react";
import { bootstrap } from "..";
import { iam, kinesisVideo } from "../aws";

function ManageUserModal({ user, hideModal }) {
  const modalRef = useRef();
  const [accessKey, setAccessKey] = useState();
  const [secretKey, setSecretKey] = useState();
  const [policies, setPolicies] = useState();
  const [streams, setStreams] = useState();

  const recreateTokens = () => {
    iam.listAccessKeys({ UserName: user.UserName }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        let size = data.AccessKeyMetadata.length;
        if (size === 0) {
          createKeys();
        } else {
          data.AccessKeyMetadata.forEach((key) =>
            iam.deleteAccessKey({ UserName: user.UserName, AccessKeyId: key.AccessKeyId }, (err, data) => {
              if (err) {
                console.error(err);
              } else {
                size -= 1;
                if (size === 0) {
                  createKeys();
                }
              }
            })
          );
        }
      }
    });
  };

  const createKeys = () => {
    iam.createAccessKey({ UserName: user.UserName }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        setAccessKey(data.AccessKey.AccessKeyId);
        setSecretKey(data.AccessKey.SecretAccessKey);
      }
    });
  };

  const updatePolicy = (stream, state) => {
    if (state) {
      const policyDocument = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["kinesisvideo:DescribeStream", "kinesisvideo:GetDataEndpoint", "kinesisvideo:GetMedia"],
            Resource: stream.StreamARN,
          },
        ],
      });

      const params = {
        PolicyDocument: policyDocument,
        PolicyName: "stream-access-" + stream.StreamName,
        UserName: user.UserName,
      };
      iam.putUserPolicy(params, (err, data) => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      iam.deleteUserPolicy(
        { UserName: user.UserName, PolicyName: "stream-access-" + stream.StreamName },
        (err, data) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  };

  useEffect(() => {
    modalRef.current = new bootstrap.Modal("#manageUserModal", {});
    kinesisVideo.listStreams({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        setStreams(data.StreamInfoList.filter((s) => s.Status !== "DELETING"));
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      modalRef.current.show();
      iam.listUserPolicies({ UserName: user.UserName }, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          setPolicies(data.PolicyNames.filter((p) => p.startsWith("stream-access-")).map((p) => p.substring(14)));
        }
      });
    } else {
      setAccessKey(null);
      setSecretKey(null);
      setPolicies(null);
      modalRef.current.hide();
    }
  }, [user]);

  const renderStream = (stream) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="form-check-input"
          type="checkbox"
          value=""
          checked={policies?.some(p => p === stream.StreamName)}
          id="flexCheckDefault"
          onChange={(e) => updatePolicy(stream, e.target.checked)}
        />
        <label for="flexCheckDefault" style={{ marginLeft: 5 }}>
          {stream.StreamName}
        </label>
      </div>
    );
  };

  return (
    <div className="modal fade" id="manageUserModal" data-bs-backdrop="static">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="manageUserModalLabel">
              {user?.UserName}
            </h5>
            <button type="button" className="btn-close" onClick={hideModal}></button>
          </div>
          <div className="modal-body">
            {streams?.map((s) => renderStream(s))}
            <div style={{ flexDirection: "row", gap: 16, justifyContent: "flex-start", marginTop: 16 }}>
              {accessKey && secretKey && (
                <div className="alert alert-success" role="alert">
                  <div>Access Token: {accessKey}</div>
                  <div>Secret Token: {secretKey}</div>
                </div>
              )}
              <button type="submit" className="btn btn-primary" onClick={recreateTokens}>
                Recreate tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ManageUserModal);
