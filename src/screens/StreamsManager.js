import { useEffect, useState } from "react";
import { bootstrap } from "..";
import { kinesisVideo } from "../aws";
import ScrollableList from "../components/ScrollableList/ScrollableList";
import CreateStreamModal from "./CreateStreamModal";

function StreamsManager() {
  const [streams, setStreams] = useState();

  useEffect(() => {
    updateStreams();
  }, []);

  const updateStreams = () => {
    kinesisVideo.listStreams({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        setStreams(data.StreamInfoList.filter((s) => s.Status !== "DELETING"));
      }
    });
  };

  const deleteStream = (stream) => {
    kinesisVideo.deleteStream({ StreamARN: stream.StreamARN }, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        updateStreams();
      }
    });
  };

  const renderStream = (stream) => {
    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", gap: 16 }}>
        <span>{stream.StreamName}</span>
        <button className="btn btn-danger" onClick={() => deleteStream(stream)}>
          Delete
        </button>
      </div>
    );
  };

  return (
    <>
      <CreateStreamModal streamUpdater={updateStreams}/>
      <ScrollableList items={streams?.map((u) => renderStream(u))} />
    </>
  );
}

export default StreamsManager;
