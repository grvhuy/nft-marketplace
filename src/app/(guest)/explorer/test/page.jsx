"use client";

import axios from "axios";
import { useEffect } from "react";

const TestPage = () => {
  useEffect(() => {
    async function fetchJSON() {
      const url =
        "https://blue-wonderful-antelope-164.mypinata.cloud/ipfs/QmSJG9x3MG6Jus9rQZRbdqAfBf3Wua8x9vtKS4r6jezKZp";
      try {
        const response = await axios.get(url);
        const data = response.data;
        console.log("JSON Data:", data);

        // Sử dụng dữ liệu JSON
        console.log("Tên Collection:", data.collections[0].name);
        console.log("Tên Người Dùng:", data.collections[0].docs[0].name);
      } catch (error) {
        console.error("Lỗi khi lấy JSON:", error.message);
      }
    }

    fetchJSON();
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
};

export default TestPage;
