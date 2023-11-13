/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { LibNote, LibNoteInterface } from "../LibNote";

const _abi = [
  {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        internalType: "bytes4",
        name: "sig",
        type: "bytes4",
      },
      {
        indexed: true,
        internalType: "address",
        name: "usr",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "arg1",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "arg2",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "LogNote",
    type: "event",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b50603e80601d6000396000f3fe6080604052600080fdfea265627a7a72315820ddc31a24e11159f89ec693973018dbebd598a8cde91ccba4c4bf155e510aa18364736f6c634300050c0032";

type LibNoteConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LibNoteConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LibNote__factory extends ContractFactory {
  constructor(...args: LibNoteConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "LibNote";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LibNote> {
    return super.deploy(overrides || {}) as Promise<LibNote>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LibNote {
    return super.attach(address) as LibNote;
  }
  connect(signer: Signer): LibNote__factory {
    return super.connect(signer) as LibNote__factory;
  }
  static readonly contractName: "LibNote";
  public readonly contractName: "LibNote";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LibNoteInterface {
    return new utils.Interface(_abi) as LibNoteInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibNote {
    return new Contract(address, _abi, signerOrProvider) as LibNote;
  }
}
