import { useEffect, useState, useRef } from "react";
import User from "../../../store/user";
import File from "../../../store/file";
import { convertUTCDateToLocalDate } from "../../../lib/helper";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Checkbox } from "@radix-ui/react-checkbox";

const DashboardItem = () => {
  const [data, setData] = useState([]);
  const { user } = User();
  const { updated, setUpdate } = File();
  const [del, setDel] = useState(false);
  const uploadFileRef = useRef(null);
  const [replaceID, setReplaceID] = useState(null);
  const params = useParams();

  useEffect(() => {
    if (!!user) {
      getFolders();
    }
  }, [user]);

  useEffect(() => {
    if (updated) {
      getFolders();
      setUpdate(false);
    }
  }, [updated]);

  useEffect(() => {
    console.log(data);
    if (
      data.filter((e) => {
        console.log(e.selected);
        return !!e.selected;
      }).length > 0
    ) {
      setDel(true);
      return;
    }
    setDel(false);
  }, [data]);

  const getFolders = async () => {
    console.log("ok");
    try {
      let res = await fetch(`http://127.0.0.1:8000/folder/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      res = await res.json();
      getFiles(
        res.map((e) => {
          e.type = "folder";
          return e;
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getFiles = async (folders) => {
    try {
      let res = await fetch(`http://127.0.0.1:8000/file/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });

      res = await res.json();
      setData([
        ...folders,
        ...res.map((e) => {
          e.type = "file";
          return e;
        }),
      ]);
    } catch {}
  };

  const deleteFolder = async (id) => {
    try {
      let res = await fetch(
        `http://127.0.0.1:8000/folder/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      setData(data.filter((e) => e.id !== id));
      setUpdate(true);
    } catch {}
  };

  const deleteFile = async (id) => {
    try {
      let res = await fetch(
        `http://127.0.0.1:8000/file/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      setData(data.filter((e) => e.id !== id));
      setUpdate(true);
    } catch (e) {
      console.log(e);
    }
  };

  const updateData = (id, value) => {
    setData(
      data.map((e) => {
        if (e.id === id) {
          e.selected = value;
        }
        return e;
      })
    );
  };

  const bulkDelete = () => {
    data.map((e) => {
      if (!!e.selected) {
        if (e.type == "folder") {
          deleteFolder(e.id);
        } else {
          deleteFile(e.id);
        }
      }
    });
  };

  const uploadFiles = async (e) => {
    let files = [...e.target.files];
    for (const file of files) {
      await uploadFile(file, params.id);
    }
    uploadFileRef.current.value = [];
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
      const res = await fetch(
        `http://127.0.0.1:8000/file/${replaceID}/?parent=${params.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Token ${user.token}`,
          },
          body: form,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUpdate(true);
        return data;
      } else {
        if (res.status === 405) {
          const data = await res.json();
          // toast({
          //   title: "Limit Reached",
          //   description: data.message,
          //   variant: "destructive",
          // });
        }
      }
    } catch {}
  };

  const createFolderDiv = (e) => {
    let options = { year: "numeric", month: "long", day: "numeric" };
    return (
      <ContextMenu key={e.id}>
        <ContextMenuTrigger>
          <div
            style={{
              display: "flex",
              width: "80%",
              justifyContent: "start",
              alignItems: "center",
              border: "2px solid white",
              margin: "auto",
              marginBottom: "10px",
            }}
          >
            <Checkbox
              style={{ height: "20px", marginLeft: "20px", cursor: "pointer" }}
              checked={!!e.selected}
              onCheckedChange={(value) => {
                updateData(e.id, value);
              }}
            />
            <div
              onClick={() => {
                //window.location.href = `/dashboard/${e.id}`;
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "0 20px",
              }}
            >
              <div>
                <p style={{ color: "white" }}>{e.name}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ color: "white" }}>Owner</p>
                <p style={{ color: "white" }}>{e.created_by.email}</p>
              </div>
              <div>
                <p style={{ color: "white" }}>Created on</p>
                <p style={{ color: "white" }}>
                  {convertUTCDateToLocalDate(e.created_on).toLocaleDateString(
                    "en-US",
                    options
                  )}
                </p>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className=""
            style={{
              backgroundColor: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              deleteFolder(e.id);
            }}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const createFileDiv = (e) => {
    let options = { year: "numeric", month: "long", day: "numeric" };

    return (
      <ContextMenu key={e.id}>
        <ContextMenuTrigger>
          <div
            style={{
              display: "flex",
              width: "80%",
              justifyContent: "start",
              alignItems: "center",
              border: "2px solid white",
              margin: "auto",
              marginBottom: "10px",
            }}
          >
            <Checkbox
              style={{ height: "20px", marginLeft: "20px", cursor: "pointer" }}
              checked={!!e.selected}
              onCheckedChange={(value) => {
                updateData(e.id, value);
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "0 20px",
              }}
            >
              <div>
                <p style={{ color: "white" }}>{e.name}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ color: "white" }}>Owner</p>
                <p style={{ color: "white" }}>{e.created_by.email}</p>
              </div>
              <div>
                <p style={{ color: "white" }}>Created on</p>
                <p style={{ color: "white" }}>
                  {convertUTCDateToLocalDate(e.created_on).toLocaleDateString(
                    "en-US",
                    options
                  )}
                </p>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            style={{
              backgroundColor: "white",
              padding: "10px 20px",
              borderRadius: "10px 10px 0 0",
              cursor: "pointer",
            }}
            onClick={() => {
              setReplaceID(e.id);
              uploadFileRef.current.click();
            }}
          >
            Replace
          </ContextMenuItem>
          <ContextMenuItem
            style={{
              backgroundColor: "white",
              padding: "10px 20px",
              borderRadius: "0 0 10px 10px",
              cursor: "pointer",
            }}
            onClick={() => {
              deleteFile(e.id);
            }}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <div className="">
      {del && (
        <button
          onClick={bulkDelete}
          style={{
            width: "80%",
            textAlign: "center",
            margin: "auto",
            height: "50px",
            display: "flex",
            backgroundColor: "#becfd1",
            borderRadius: "40px",
            border: "none",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
            fontSize: "25px",
            fontWeight: "bold",
          }}
        >
          Delete All
        </button>
      )}
      {data.map((e) => {
        if (e.type === "folder") {
          return createFolderDiv(e);
        } else {
          return createFileDiv(e);
        }
      })}
      <input
        type="file"
        ref={uploadFileRef}
        className="hidden"
        onChange={uploadFiles}
        style={{ visibility: "hidden" }}
      />
    </div>
  );
};

export default DashboardItem;
