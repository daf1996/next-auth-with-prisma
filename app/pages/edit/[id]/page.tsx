"use client";

import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, Button, styled, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import router from "next/router";
import { useRouter } from "next/navigation";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Edit({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();

  const [docName, setDocName] = useState<string>();
  const [checked, setChecked] = useState(false);
  const [fileDoc, setFileDoc] = useState<File>();
  const [editNo, setEditNo] = useState<Number>(0);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchPost(parseInt(id));
    }
  }, [id]);

  const fetchPost = async (id: Number) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      console.log(res.data,res.data.editNo + 1);
      setDocName(res.data.title);
      setChecked(res.data.published);
      setEditNo(res.data.editNo + 1);
      //   setContent(res.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(docName, checked);

    try {
      await axios.put(`/api/posts/${id}`, {
        title: docName,
        published: checked,
        editNo: editNo,
      });

      Swal.fire({
        title: "แก้ไขสำเร็จ",
        icon: "success",
        timer: 2000,
      });
      router.push("/pages/home");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleChecked = () => {
    setChecked((prev: boolean) => !prev);
  };

  return (
    <>
      <div className="relative flex flex-col rounded-xl bg-gray-50 items-center pt-5">
        <h4 className="block text-xl font-medium text-slate-800">
          แก้ไขเอกสาร
        </h4>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                ชื่อเอกสาร
              </label>
              <input
                type="text"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                placeholder="ชื่อเอกสาร"
                value={docName}
                onChange={(e: any) => {
                  setDocName(e.target.value);
                }}
              />
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                สถานะเอกสาร
              </label>
              <FormControlLabel
                control={<Switch checked={checked} />}
                label={`สถานะเอกสาร ${checked ? "เผยแพร่" : "ไม่เผยแพร่"}`}
                onChange={toggleChecked}
              />
            </div>
            {/* <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              เลือกไฟล์
              <VisuallyHiddenInput
                type="file"
                onChange={async (e) => {
                  setFileDoc(e.target.files as unknown as File);
                }}
              />
            </Button> */}
          </div>
          <button
            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
          >
            บันทึก
          </button>
        </form>
      </div>
    </>
  );
}
