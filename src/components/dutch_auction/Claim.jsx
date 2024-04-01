import Button from "../Button";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONFIG } from "../../../config";
import CollateralPool from "../../abis/CollateralPool.json";
import PunkWarriorErc721 from "../../abis/PunkWarriorErc721.json";
import SToken from "../../abis/SToken.json";
import { SnackbarProvider, useSnackbar } from "notistack";

const Bid = () => {
  const [formData, setFormData] = useState({
    TokenId: "",
    MsgValue: "",
    STokenAmount: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
  };
  // Approve
  const {
    data: hashApprove,
    writeContract: writeApprove,
    isPending,
  } = useWriteContract();

  async function approve() {
    writeApprove({
      address: CONFIG.AUCTION_CONTRACT_ADDRESS,
      abi: PunkWarriorErc721,
      functionName: "claimAuctionItem",
    });
  }

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({
      hash: hashApprove,
    });

  // Redeem
  const { data: hashCollateralize, writeContract: writeCollateralize } =
    useWriteContract();

  async function redeem() {
    writeCollateralize({
      address: CONFIG.POOL_CONTRACT_ADDRESS,
      abi: CollateralPool,
      functionName: "redeem",
      value: BigInt(Number(formData.MsgValue) * 1e18),
      args: [CONFIG.FBAYC_CONTRACT_ADDRESS, Number(formData.TokenId)],
    });
  }

  const { isLoading: isRepayConfirming, isSuccess: isRepayConfirmed } =
    useWaitForTransactionReceipt({
      hash: hashCollateralize,
    });

  const MyFeeback = () => {
    // const [isConfirmed, setIsConfirmed] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
      enqueueSnackbar("I love snacks.");
    };

    const handleClickVariant = (variant) => () => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar("Transaction successful!!", { variant });
    };

    const wasPreviouslyConfirmed = useRef(false);

    useEffect(() => {
      if (isRepayConfirmed && !wasPreviouslyConfirmed.current) {
        handleClickVariant("success")();
        wasPreviouslyConfirmed.current = true;
      }
    }, [isRepayConfirmed]);
  };

  useEffect(() => {
    if (isApproveConfirmed) {
        redeem();
    }
  }, [isApproveConfirmed]);
  

  return (
    <form onSubmit={handleSubmit} class="max-w-md mx-auto">
      {/* Token Id */}
    

      <div class="relative z-0 w-full mb-5 group">
        <Button
          type="submit"
          className="text-[1rem]"
          disabled={!approve || isPending}
          onClick={approve}
        >
          {isPending ? "Confirming..." : "Claim & Refund"}
          {isApproveConfirming ? " : Waiting for transaction..." : ""}
        </Button>
        <SnackbarProvider
          maxSnack={1}
          autoHideDuration={5000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MyFeeback />
        </SnackbarProvider>
      </div>
    </form>
  );
};

export default Bid;
