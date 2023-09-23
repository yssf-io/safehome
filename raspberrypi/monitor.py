import requests as req
from web3 import Web3
from hexbytes import HexBytes
from eth_account.messages import encode_defunct

attached_safe = "0xCDceCF435EA89e5BF5652696BfE9755eEcB1D1db"


def fetch_signatures():
    r = req.get("http://localhost:3000/api/safes/" + attached_safe)
    print(r.json())
    return r.json()


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


fetch_signatures()
