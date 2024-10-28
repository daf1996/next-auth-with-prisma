"use client";

import React, { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { Autocomplete, Button, styled, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import router from "next/router";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

export default function AddTopic() {
  const { data: session, status } = useSession();

  const [optionsDepts, setOptionsDepts] = useState<any[]>([]); // ตั้งค่าเป็น array ว่างเริ่มต้น
  const [optionsDocTypes, setOptionsDocTypes] = useState<any[]>([]); // ตั้งค่าเป็น array ว่างเริ่มต้น
  const [selectedDept, setSelectedDept] = useState<null | string>();
  const [selectedDoc, setSelectedDoc] = useState<null | string>();
  const [docName, setDocName] = useState<string>();
  const [fileDoc, setFileDoc] = useState<File>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchDepts(); // เรียกฟังก์ชันดึงข้อมูลเมื่อ component ถูกโหลด
    fetchDocTypes();
    // console.log(session?.user.id);
  }, []);

  const fetchDepts = async () => {
    try {
      const res = await axios.get("/api/master-data/departments");
      // console.log(res.data);
      setOptionsDepts(res.data); // อัปเดตข้อมูลเมื่อดึงมาได้
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchDocTypes = async () => {
    try {
      const res = await axios.get("/api/master-data/documenttype");
      // console.log(res.data);
      setOptionsDocTypes(res.data); // อัปเดตข้อมูลเมื่อดึงมาได้
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (fileDoc) {
        const formData = new FormData();
        Object.values(fileDoc).forEach((file) => {
          formData.append("file", file);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          console.log("respone upload", result);

          // alert("Upload ok : " + result.name);
          await axios.post("/api/posts", {
            type: selectedDoc,
            department: selectedDept,
            title: docName,
            author: session?.user?.name,
            filePath: result.name,
          });

          Swal.fire({
            title: "สำเร็จ",
            icon: "success",
            timer: 2000,
          });

          // setDocName('')
          // setSelectedDept('')
        } else {
          console.log("Upload failed");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false when the request completes
    }
  };

  return (
    <>
      {/* {session} */}
      <div className="relative flex flex-col rounded-xl bg-gray-50 items-center pt-5">
        <h4 className="block text-xl font-medium text-slate-800">
          เพิ่มเอกสารใหม่
        </h4>
        <form
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
          onSubmit={handleSubmit}
        >
          <div className="mb-1 flex flex-col gap-6">
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                หน่วยงาน
              </label>
              {optionsDepts ? ( // ตรวจสอบว่ามีข้อมูลแล้ว
                <Autocomplete
                  disablePortal
                  options={optionsDepts}
                  placeholder="หน่วยงาน"
                  className="w-full bg-transparent text-slate-400 text-sm rounded-md"
                  size="small"
                  value={selectedDept}
                  disableClearable={true}
                  onChange={(event: any, newValue: any | null) => {
                    setSelectedDept(newValue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="หน่วยงาน" />
                  )}
                />
              ) : (
                <p>กำลังโหลดข้อมูล...</p> // แสดงข้อความขณะรอดึงข้อมูล
              )}
            </div>
            <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                ประเภทเอกสาร
              </label>
              {optionsDocTypes ? ( // ตรวจสอบว่ามีข้อมูลแล้ว
                <Autocomplete
                  disablePortal
                  options={optionsDocTypes}
                  placeholder="ประเภทเอกสาร"
                  className="w-full bg-transparent text-slate-400 text-sm rounded-md"
                  size="small"
                  disableClearable={true}
                  onChange={(event: any, newValue: any | null) => {
                    setSelectedDoc(newValue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="ประเภทเอกสาร" />
                  )}
                />
              ) : (
                <p>กำลังโหลดข้อมูล...</p> // แสดงข้อความขณะรอดึงข้อมูล
              )}
            </div>
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
            {/* <input
              type="file"
              name="file"
              onChange={async (e) => {
                setFileDoc(e.target.files as unknown as File);
              }}
            /> */}
            {/* <div className="w-full max-w-sm min-w-[200px]">
              <label className="block mb-2 text-sm text-slate-600">
                ชื่อไฟล์
              </label>
            </div> */}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              เลือกไฟล์
              <VisuallyHiddenInput
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={async (e) => {
                  setFileDoc(e.target.files as unknown as File);
                }}
              />
            </Button>
          </div>
          <button
            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
            disabled={isLoading}
          >
            
            {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </form>
      </div>
    </>
  );
}
