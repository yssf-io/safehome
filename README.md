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
