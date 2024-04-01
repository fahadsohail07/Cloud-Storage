import ProgressBar from "@ramonak/react-progress-bar";
import DashboardItem from "./DashboardItem/DashboardItem";
//import { Toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import User from "../../store/user";
import File from "../../store/file";
import "./Dashboard.css";

const Dashboard = () => {
  const { Userlogged, user } = User();
  const [openNewFolder, setOpenNewFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const params = useParams();
  const uploadFileRef = useRef(null);
  const uploadFolderRef = useRef(null);
  const [userStorage, setUserStorage] = useState({});
  const { updated, setUpdate } = File();

  useEffect(() => {
    if (Userlogged === "invalid") {
      //router.push("/auth/login")
    }
    get_user_storage_detail();
  }, [Userlogged]);

  useEffect(() => {
    if (updated) {
      get_user_storage_detail();
    }
  }, [updated]);

  const get_user_storage_detail = async () => {
    try {
      let res = await fetch(
        `http://127.0.0.1:8000/user/${user.id}/get_storage/`,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );
      if (res.ok) {
        res = await res.json();
        setUserStorage(res);
      }
    } catch {}
  };

  const handleNewFolder = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/folder/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
        body: JSON.stringify({ name: folderName, parent: params.id }),
      });

      const data = await res.json();
      setOpenNewFolder(false);
      setUpdate(true);
    } catch {}
  };

  const createNewFolder = async (name, id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/folder/`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.token}`,
        },
        body: JSON.stringify({ name: name, parent: id }),
      });

      const data = await res.json();
      return data;
    } catch {}
  };

  const uploadFile = async (file, id) => {
    let form = new FormData();
    form.append("name", file.name);
    form.append("size", file.size / 1000000);
    if (!!id) {
      form.append("folder", id);
    }
    form.append("file", file);
    try {
      const res = await fetch(`http://127.0.0.1:8000/file/`, {
        method: "post",
        headers: {
          Authorization: `Token ${user.token}`,
        },
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        setUpdate(true);
        return data;
      } else {
        if (res.status === 405) {
          const data = await res.json();
          //   Toast({
          //     title: "Limit Reached",
          //     description: data.message,
          //     variant: "destructive",
          //   });
        }
      }
    } catch {}
  };

  const startUploading = async (struct, id) => {
    for (let key in struct) {
      if (!!!struct[key].lastModified) {
        let folder_id = await createNewFolder(key, !!id ? id : params.id);
        await startUploading({ ...struct[key] }, folder_id.id);
      } else {
        await uploadFile(struct[key], id);
      }
    }
  };

  const uploadFiles = async (e) => {
    for (const file of e.target.files) {
      await uploadFile(file, !!params.id ? params.id : null);
    }
  };

  const UploadFolder = (e) => {
    let struct = {};
    for (const file of e.target.files) {
      let path = file.webkitRelativePath.split("/");
      let prev = struct;
      path.forEach((p, i) => {
        if (i === path.length - 1) {
          prev[file.name] = file;
        } else {
          if (i === path.length - 2) {
            if (!!!prev[p]) {
              prev[p] = {};
            }
          } else {
            if (!!!prev[p]) {
              prev[p] = {};
            }
          }
          prev = prev[p];
        }
      });
    }
    console.log(struct);
    startUploading(struct);
  };

  return (
    <div className="dashboard">
      <h2
        style={{
          margin: 0,
          textAlign: "center",
          color: "white",
          fontSize: "40px",
          padding: "30px 0",
        }}
      >
        Please select an option
      </h2>
      <div className="dashboard-buttons">
        <button
          onClick={() => {
            uploadFileRef.current.click();
          }}
        >
          Upload files
        </button>
        <button
          onClick={() => {
            uploadFolderRef.current.click();
          }}
        >
          Upload folder
        </button>
      </div>

      <div className="dashboard-progress-bar">
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <p>Daily Limit</p>
            {!!userStorage.total_band && (
              <label>
                {userStorage.band_used.toFixed(3)}/{userStorage.total_band}
                <span> Mb</span>
              </label>
            )}
          </div>
          <ProgressBar
            completed={(userStorage.band_used / userStorage.total_band) * 100}
            width="30vw"
          />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <p>Total Storage</p>

            {!!userStorage.total_band && (
              <label>
                {userStorage.used_storage.toFixed(3)}/
                {userStorage.total_storage}
                <span> Mb</span>
              </label>
            )}
          </div>
          <ProgressBar
            completed={
              (userStorage.used_storage / userStorage.total_storage) * 100
            }
            width="30vw"
          />
        </div>
      </div>
      <input
        type="file"
        ref={uploadFolderRef}
        className="hidden"
        webkitdirectory=""
        multiple
        onChange={UploadFolder}
        style={{ visibility: "hidden" }}
      />
      <input
        type="file"
        ref={uploadFileRef}
        multiple
        className="hidden"
        onChange={uploadFiles}
        style={{ visibility: "hidden" }}
      />
      <DashboardItem />
    </div>
  );
};

export default Dashboard;
