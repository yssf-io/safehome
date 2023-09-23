import RPi.GPIO as GPIO
import time
import requests as req
from web3 import Web3
from hexbytes import HexBytes
from eth_account.messages import encode_defunct

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
