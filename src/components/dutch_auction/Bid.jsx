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
    BidPrice: "",
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
      address: CONFIG.STOKEN_CONTRACT_ADDRESS,
      abi: SToken,
      functionName: "approve",
      args: [CONFIG.AUCTION_CONTRACT_ADDRESS, Number(formData.BidPrice) * 1e18],
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
      address: CONFIG.AUCTION_CONTRACT_ADDRESS,
      abi: PunkWarriorErc721,
      functionName: "bid",
      args: [Number(formData.BidPrice) * 1e18],
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
        <input
          type="text"
          name="BidPrice"
          value={formData.BidPrice}
          onChange={handleChange}
          class="block py-2.5 px-0 w-full text-sm text-n-1 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-purple-500 focus:outline-none focus:ring-0 focus:border-purple-600 peer"
          placeholder=" "
          required
        />
        {errors.BidPrice && <span>{errors.BidPrice}</span>}
        <label
          for="Bid Price"
          class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-purple-600 peer-focus:dark:text-purple-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Bid Price
        </label>
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <Button
          type="submit"
          className="text-[1rem]"
          // disabled={!approve || isPending}
          onClick={approve}
        >
          {isPending ? "Confirming..." : "Bid"}
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
