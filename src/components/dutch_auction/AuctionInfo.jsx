import * as React from "react";
import Web3 from "web3";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONFIG } from "../../../config";
import FakeBAYC from "../../abis/FakeBAYC.json";
import SToken from "../../abis/SToken.json";
import PunkWarriorErc721 from "../../abis/PunkWarriorErc721.json";
import CollateralPoolLoan from "../../abis/CollateralPoolLoan.json";
import { Coin } from "../../assets";

const columns = [
  {
    field: "id",
    headerName: "PARAMETER NAME",
    headerAlign: "center",
    width: 270,
    renderCell: (params) => (
      <div
        style={{
          borderRight: "solid #757185",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          wordWrap: "break-word", // 添加自动换行的样式
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "value",
    headerName: "VALUE",
    headerAlign: "center",
    width: 220,
    editable: true,
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          wordWrap: "break-word",
        }}
      >
        {params.value}
      </div>
    ),
  },
  //   {
  //     field: "fullName",
  //     headerName: "Full name",
  //     description: "This column has a value getter and is not sortable.",
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  //   },
];

export default function AuctionInfo() {
  const { data: currentPrice, refetch: refetchCurrentPrice } = useReadContract({
    abi: PunkWarriorErc721,
    address: CONFIG.AUCTION_CONTRACT_ADDRESS,
    functionName: "getAuctionPrice",
  });

  const { data: auctionIndex, refetch: refetchAuctionIndex } = useReadContract({
    abi: PunkWarriorErc721,
    address: CONFIG.AUCTION_CONTRACT_ADDRESS,
    functionName: "auctionIndex",
  });

  const { data: auctionData, refetch: refetchAuctionData } = useReadContract({
    abi: PunkWarriorErc721,
    address: CONFIG.AUCTION_CONTRACT_ADDRESS,
    functionName: "auctionData",
    args: [auctionIndex],
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      refetchAuctionIndex?.();
      refetchAuctionData?.();
      refetchCurrentPrice?.();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dataList = String(auctionData).split(",");

  const rows = [
    { id: "Auction start time", value: formatTimestamp(dataList[0]) },
    { id: "Auction end time", value: formatTimestamp(dataList[1]) },
    { id: "Duration between deductions", value: dataList[2] },
    { id: "Initial price", value: Number(dataList[3]) / 1e18 + " SToken" },
    { id: "Final price", value: Number(dataList[4]) / 1e18 + " SToken" },
    { id: "Last bid price", value: Number(dataList[5]) / 1e18 + " SToken" },
    {
      id: "Amount decreased each time",
      value: Number(dataList[6]) / 1e18 + " SToken",
    },
    { id: "Item Limit", value: dataList[7] + " items" },
    { id: "Total bidders", value: dataList[8] },
    { id: "Auction Status", value: dataList[9] === "true" ? "OPEN" : "CLOSE" },
    {
      id: "Refund Status",
      value: dataList[10] === "true" ? "Refunded" : "Not Refunded",
    },
  ];

  // 格式化时间戳
  function formatTimestamp(timestamp) {
    const date = new Date(Number(timestamp) * 1000);
    return (
      date.getFullYear() +
      "/" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getDate().toString().padStart(2, "0") +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0") +
      ":" +
      date.getSeconds().toString().padStart(2, "0")
    );
  }

  function sortString(value) {
    const tokenIdListString = String(value);
    const tokenIdListArray = tokenIdListString.split(",").map(Number);
    tokenIdListArray.sort((a, b) => a - b);
    const sortedTokenIdListString = tokenIdListArray.join(",");
    return sortedTokenIdListString;
  }

  return (
    <Box
    //   sx={{
    //     height: 400,
    //     width: "100%",
    //     "& .MuiDataGrid-cell, & .MuiTablePagination-root": {
    //       color: "white", // 设置文字颜色为白色
    //     },
    //   }}
    >
      <div className="flex items-center px-4 py-1 bg-purple-700 rounded text-n-8 mb-5">
        <img className="mr-2.5" src={Coin} width={50} height={50} alt="Coin" />
        <div className="tagline text-white text-2xl">
          <p>CURRENT PRICE : {Number(currentPrice) / 1e18} SToken</p>
        </div>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        autoHeight
        // checkboxSelection
        // disableRowSelectionOnClick
        sx={{
          width: "100%",
          "& .MuiDataGrid-cell": {
            color: "white", // 设置文字颜色为红色
            fontSize: "16px",
          },
        }}
      />
    </Box>
  );
}
