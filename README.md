# SafeHome - ETHGlobal New York

This projects aims at using the Safe Protocol to manage various aspects of your home, mainly:

- financial: roommate/family joint account to pay home bills
- access: only unlocking the door if permitted by the Safe
- rental: onchain rental management

### Structure

- WebApp (`/webapp`): Alternative frontend for Safe, specialized in Home management
- Raspberry Pi Smart Lock: raspberry pi-based circuit that lights a LED when signature is received
- Mobile App: to create an EOA and send signature to open the door
- API: accessing a database and to allow apps and door to talk to each other

### Contracts

- EntranceKeys

  - Tracks keys minted by safe owner for their guests
  - polygon -> [0x52868465c73937007D3ADDbde1fE7077419B2122](https://polygonscan.com/address/0x52868465c73937007d3addbde1fe7077419b2122)
  - base goerli -> [0x693980bE93634c45634c5704B6463321e9e34428](https://goerli.basescan.org/address/0x693980be93634c45634c5704b6463321e9e34428)

- RentalAgreements
  - Tracks Rental proposals and agreements, handles the money in escrow and mint Entrance Keys
  - polygon -> [0x7337d4d395bee0F48D9102378F97BDa5faBd0a39](https://polygonscan.com/address/0x7337d4d395bee0F48D9102378F97BDa5faBd0a39)
  - base goerli -> [0x0b7E21DfCa98B2eb6b96894808A1bb848Dc0F67d](https://goerli.basescan.org/address/0x0b7e21dfca98b2eb6b96894808a1bb848dc0f67d)
