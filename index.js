const { ethers } = require("ethers");

const contractAddress = "0x0cD0E724E832A27302C9714126fF6EA2B42d636B";
const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_invoiceId",
        type: "uint256",
      },
    ],
    name: "getInvoiceById",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "sellerPan",
            type: "string",
          },
          {
            internalType: "string",
            name: "invoiceAmount",
            type: "string",
          },
          {
            internalType: "string",
            name: "invoiceDate",
            type: "string",
          },
          {
            internalType: "string",
            name: "status",
            type: "string",
          },
        ],
        internalType: "struct Ledger.Invoice",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_buyerPan",
        type: "string",
      },
    ],
    name: "getInvoiceIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_buyerPan",
        type: "string",
      },
      {
        internalType: "string",
        name: "_sellerPan",
        type: "string",
      },
      {
        internalType: "string",
        name: "_invoiceAmount",
        type: "string",
      },
      {
        internalType: "string",
        name: "_invoiceDate",
        type: "string",
      },
      {
        internalType: "string",
        name: "_status",
        type: "string",
      },
    ],
    name: "saveInvoice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const buyerPan = document.getElementById("buyerPan");
const sellerPan = document.getElementById("sellerPan");
const invoiceAmount = document.getElementById("invoiceAmount");
const invoiceDate = document.getElementById("invoiceDate");
const status = document.getElementById("paymentStatus");
const invoiceArea = document.getElementById("invoiceArea");

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const ledger = new ethers.Contract(contractAddress, abi, signer);
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    document.getElementById("connectButton").innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install MetaMask";
  }
}

async function execute() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const ledger = new ethers.Contract(contractAddress, abi, signer);
  const tx = await ledger.saveInvoice(
    buyerPan.value,
    sellerPan.value,
    invoiceAmount.value,
    invoiceDate.value,
    status.value
  );
  await tx.wait(1);
}

async function getInvoice() {
  const buyerPanDetails = document.getElementById("buyerPanDetails").value;
  console.log(buyerPanDetails);
  let ids = await ledger.getInvoiceIds(buyerPanDetails);
  console.log("Id's are: ");
  ids = ids.map((id) => id.toNumber());
  console.log(ids);

  for (id of ids) {
    console.log(`Invoice no ${id}:`);
    let temp = invoiceArea.innerHTML;
    const { sellerPan, invoiceAmount, invoiceDate, status } =
      await ledger.getInvoiceById(id);
    invoiceArea.innerHTML =
      temp +
      `<br>Seller PAN: ${sellerPan}, Invoice Amount: ${invoiceAmount},Invoice Date:  ${invoiceDate}, Payment Status: ${status}`;
    console.log(sellerPan, invoiceAmount, invoiceDate, status);
  }
}

module.exports = { connect, execute, getInvoice };
