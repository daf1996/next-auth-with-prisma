// components/TableWithColumnFiltersAndSearch.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  Box,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  ButtonGroup,
} from "@mui/material";
import { Delete as DeleteIcon, Download as DownloadIcon, Edit as EditIcon } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Define the type for each row of data
interface DataRow {
  id: number;
  title: string;
  department: string;
  type: string;
  editNo: number;
  filePath: string;
  author: string;
  published: boolean;
  docNo: number;
}

const TableWithColumnFiltersAndSearch: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [filteredData, setFilteredData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();
  const { data: session } = useSession();

  // Filter state for each column
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [publishedFilter, setPublishedFilter] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<DataRow[]>("/api/posts"); // Replace with your API endpoint
      setData(response.data);
      setFilteredData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = data.filter((row) =>
      (!departmentFilter || row.department === departmentFilter) &&
      (!typeFilter || row.type === typeFilter) &&
      (publishedFilter === "" || String(row.published) === publishedFilter) &&
      (!searchTerm || Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase())))
    );
    setFilteredData(filtered);
    setPage(0); // Reset to the first page when filters change
  }, [data, departmentFilter, typeFilter, publishedFilter, searchTerm]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const download = async (fileName: string) => {
    try {
      const response = await axios.get(`/api/download?filename=${encodeURIComponent(fileName)}`, {
        responseType: "blob", // Important for binary data
      });
      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      const downloadedFileName = fileNameMatch ? fileNameMatch[1] : fileName;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", downloadedFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handlerDelete = async (id: number) => {
    Swal.fire({
      title: "ต้องการลบใช่ไหม ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/posts/${id}`);
          fetchData();
        } catch (error) {
          console.error("Failed to delete the post", error);
        }
        Swal.fire({
          title: "ลบสำเร็จ",
          icon: "success",
        });
      }
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={3}>
        <CircularProgress />
      </Box>
    );
  }

  const uniqueValues = (key: keyof DataRow) => {
    return Array.from(new Set(data.map((row) => String(row[key]))));
  };

  return (
    <Paper>
      <Box display="flex" gap={2} p={2}>
        <TextField
          label="ค้นหา"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth>
          <InputLabel>Filter Department</InputLabel>
          <Select
            label="Filter Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            {uniqueValues("department").map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Filter Type</InputLabel>
          <Select
            label="Filter Type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            {uniqueValues("type").map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Filter Published</InputLabel>
          <Select
            label="Filter Published"
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="true">เผยแพร่</MenuItem>
            <MenuItem value="false">ไม่เผยแพร่</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>DOC NO.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Download</TableCell>
              <TableCell>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {`${row.department}-${row.type}-${String(row.docNo).padStart(3, "0")}-${String(row.editNo).padStart(2, "0")}`}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {row.published ? (
                      <Chip label="เผยแพร่" color="success" />
                    ) : (
                      <Chip label="ไม่เผยแพร่" color="error" />
                    )}
                  </TableCell>
                  <TableCell>
                    {row.filePath && (
                      <IconButton color="primary" onClick={() => download(row.filePath)}>
                        <DownloadIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    {(session?.user?.name === row.author || session?.user?.name == 'ชลีพร บุญเกิด') && (
                      <ButtonGroup variant="text">
                        <IconButton color="warning" onClick={() => router.push(`./edit/${row.id}`)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handlerDelete(row.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ButtonGroup>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableWithColumnFiltersAndSearch;
