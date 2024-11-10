import { useEffect, useRef, useState } from "react";
import { bootstrap } from "..";
import { kinesisVideo } from "../aws";

function CreateStreamModal({streamUpdater}) {
  const [stream, setStream] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    modalRef.current = new bootstrap.Modal("#createStreamModal", { });
  }, []);

  const handleSubmit = (e) => {
    kinesisVideo.createStream({StreamName: stream}, (err, data) => {
      if (err) {
        console.error(err)
      } else {
        streamUpdater()
        modalRef.current.hide();
      }
    })
  };

  return (
    <div>
    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createStreamModal">
      Create a stream
    </button>
    <div
      className="modal fade"
      id="createStreamModal"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createStreamModalLabel">
              Create Stream
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="streamInput"
                value={stream}
                style={{ marginBottom: 16 }}
                onChange={(e) => setStream(e.target.value)}
                placeholder="Stream"
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

export default CreateStreamModal;
