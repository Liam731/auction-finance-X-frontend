import * as React from "react";
import Button from "../Button";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { CONFIG } from "../../../config";
import FakeBAYC from "../../abis/FakeBAYC.json";
import { SnackbarProvider, useSnackbar } from "notistack";

const Mint = () => {
  const {
    data: mintHash,
    writeContract: writeContract,
    isPending,
  } = useWriteContract();
  async function submit() {
    writeContract({
      address: CONFIG.FBAYC_CONTRACT_ADDRESS,
      abi: FakeBAYC,
      functionName: "mint",
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: mintHash,
    });
    const result = useReadContract({
      abi: FakeBAYC,
      address: CONFIG.FBAYC_CONTRACT_ADDRESS,
      functionName: "balanceOf",
    });
  function MyFeeback() {
    // const [isConfirmed, setIsConfirmed] = React.useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
      enqueueSnackbar("I love snacks.");
    };

    const handleClickVariant = (variant) => () => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar("Transaction successful!!", { variant });
    };

    const wasPreviouslyConfirmed = React.useRef(false);

    React.useEffect(() => {
      if (isConfirmed && !wasPreviouslyConfirmed.current) {
        handleClickVariant("success")();
        wasPreviouslyConfirmed.current = true;
      }
    }, [isConfirmed]);
  }
  
  return (
    <form class="max-w-md mx-auto">
      <div class="relative z-0 w-full mb-5 group">
        <div className="mb-10 -my-10">
          <img
            className="w-full rounded-[0.8rem]"
            src={
              "https://ipfs.io/ipfs/QmesrK8rNHy6HEyscLtDeBGPFsxo7ZpZ9caP7JgCGvJGWP/1.jpeg"
            }
            width={628}
            height={426}
            alt="FBAYC"
          />
        </div>
        <Button
          type="submit"
          className="text-[1rem]"
          disabled={!submit || isPending}
          onClick={submit}
        >
          {isPending ? "Confirming..." : "Mint"}
          {isConfirming ? " : Waiting for transaction..." : ""}
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

export default Mint;
