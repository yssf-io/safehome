import RPi.GPIO as GPIO
import time
import requests as req
from web3 import Web3
from hexbytes import HexBytes
from eth_account.messages import encode_defunct

ABI = [
    {"inputs": [], "stateMutability": "nonpayable", "type": "constructor"},
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
            },
        ],
        "name": "Approval",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address",
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool",
            },
        ],
        "name": "ApprovalForAll",
        "type": "event",
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address",
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256",
            },
        ],
        "name": "Transfer",
        "type": "event",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "getApproved",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "address", "name": "operator", "type": "address"},
        ],
        "name": "isApprovedForAll",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "name": "keys",
        "outputs": [
            {"internalType": "address", "name": "safe", "type": "address"},
            {"internalType": "uint256", "name": "expiration", "type": "uint256"},
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "safe", "type": "address"},
            {"internalType": "uint256", "name": "expiration", "type": "uint256"},
            {"internalType": "address", "name": "to", "type": "address"},
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "ownerOf",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "from", "type": "address"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "from", "type": "address"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"internalType": "bytes", "name": "data", "type": "bytes"},
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "operator", "type": "address"},
            {"internalType": "bool", "name": "approved", "type": "bool"},
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}],
        "name": "supportsInterface",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
        "name": "tokenURI",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {"internalType": "address", "name": "from", "type": "address"},
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
    },
]

GPIO.setmode(GPIO.BOARD)
GPIO.setup(18, GPIO.OUT)

attached_safe = "0xCDceCF435EA89e5BF5652696BfE9755eEcB1D1db"

SERVER_URL = "http://localhost:3000/"


def fetch_owners():
    owners = req.get(SERVER_URL + "api/safes/" + attached_safe).json()
    return owners["owners"]


def fetch_signatures():
    signatures = req.get(SERVER_URL + "api/signatures/" + attached_safe).json()
    return signatures["signatures"]


def verify_signature(address, message, signature):
    w3 = Web3(Web3.HTTPProvider("http://localhost:8545"))

    # Hash the message
    message_hash = encode_defunct(text=message)

    # Recover the address from the signature
    recovered_address = w3.eth.account.recover_message(
        message_hash, signature=HexBytes(signature)
    )

    # Verify the address
    is_valid = recovered_address.lower() == address.lower()
    print(is_valid)

    print(recovered_address)
    print(address)
    return recovered_address.lower() == address.lower()


def check_key():
    # Initialize web3
    RPC_URL = (
        "https://polygon-mainnet.g.alchemy.com/v2/Qbu8MI_V5aZkKLJXqHr__2LRjrdAmLhE"
    )
    w3 = Web3(Web3.HTTPProvider(RPC_URL))

    # Check if connected to Ethereum
    if not w3.isConnected():
        print("Not connected to Polygon")
        return

    # Contract Info
    CONTRACT_ADDRESS = "0x52868465c73937007D3ADDbde1fE7077419B2122"
    CONTRACT_ABI = ABI  # Replace with your contract's ABI

    # Initialize contract
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

    # Token ID of the NFT
    token_id = 1

    owner = contract.functions.ownerOf(token_id).call()
    print("owner is", owner)


def main():
    signatures = fetch_signatures()
    print(signatures)
    if len(signatures) >= 1:
        signature = signatures[0]
        owners = fetch_owners()
        verified = [
            verify_signature(
                owner["address"],
                "unlocking door",
                signature["signature"],
            )
            for owner in owners
        ]

        if any(verified):
            print("Should open the door")
            GPIO.output(18, GPIO.HIGH)
            time.sleep(3)
            GPIO.output(18, GPIO.LOW)
            GPIO.cleanup()

    else:
        print("No signatures")


if __name__ == "__main__":
    main()
