import * as React from "react";
import Web3 from 'web3';
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

export default function UserInfo() {
  const { address: msgSender } = useAccount();
  const [statusInfo, setStatusInfo] = React.useState([]);

  const {data: FBAYCBalance, refetch: refetchFBAYCBalance } = useReadContract({
      abi: FakeBAYC,
      address: CONFIG.FBAYC_CONTRACT_ADDRESS,
      functionName: "balanceOf",
      args: [msgSender],
    });

  const { data: tokenIdList, refetch: refetchTokenList } = useReadContract({
    abi: FakeBAYC,
    address: CONFIG.FBAYC_CONTRACT_ADDRESS,
    functionName: "getPersonalTokenIdList",
    args: [msgSender],
  });

  const { data: LoanTokenIdList, refetch: refetchLoanTokenIdList } = useReadContract({
    abi: CollateralPoolLoan,
    address: CONFIG.POOL_LOAN_CONTRACT_ADDRESS,
    functionName: "getPersonalLoanTokenList",
    args: [msgSender],
  });

  const { data: STokenBalance, refetch: refetchSTokenBalance } = useReadContract({
    abi: SToken,
    address: CONFIG.STOKEN_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [msgSender],
  });

  const { data: auctionItemBalance, refetch: refetchAuctionItemBalance } = useReadContract({
    abi: PunkWarriorErc721,
    address: CONFIG.AUCTION_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [msgSender],
  });


  
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetchFBAYCBalance?.();
      refetchTokenList?.();
      refetchLoanTokenIdList?.();
      refetchSTokenBalance?.();
      refetchAuctionItemBalance?.();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const rows = [

    { id: "FBAYC balance", value: String(FBAYCBalance) },
    { id: "FBAYC token id list", value: sortString(tokenIdList) },
    { id: "Collateral token id list", value: sortString(LoanTokenIdList) },
    { id: "SToken balance", value: String((Number(STokenBalance) / 1e18).toFixed(3)) + " SToken" },
    { id: "Auction item balance", value: String(auctionItemBalance) },
  ];

  function sortString(value) {
    const tokenIdListString = String(value);
    const tokenIdListArray = tokenIdListString.split(',').map(Number);
    tokenIdListArray.sort((a, b) => a - b);
    const sortedTokenIdListString = tokenIdListArray.join(',');
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
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        autoHeight
        // checkboxSelection
        // disableRowSelectionOnClick
        sx={{
          width: '100%',
          "& .MuiDataGrid-cell": {
            color: "white",
            fontSize: "16px",
          },
        }}
      />
      
    </Box>
  );
}
