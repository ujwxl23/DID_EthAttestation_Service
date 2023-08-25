import React, { useState } from 'react'
import {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRegistry
} from '@ethereum-attestation-service/eas-sdk'
import { ethers } from 'ethers'

const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e' // Sepolia v0.26

const EASFormOffChain = () => {
  const [isValidSignature, setIsValidSignature] = useState(false)

  const createAttestation = async () => {
    const provider = ethers.providers.getDefaultProvider('sepolia')
    const privateKey =
      '4cf942524364e18911cbabfc18a13fa8a90406abff68a7efa2f7840c7ff14946'
    const signer = new ethers.Wallet(privateKey, provider)
    const unix = Math.round(+new Date()/1000);

    // Assume that eas and sender are initialized elsewhere in your app
    const eas = new EAS(EASContractAddress, { signerOrProvider: signer })

    const offchain = await eas.getOffchain()

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("string Name, uint8 Age, string Message");
    const encodedData = schemaEncoder.encodeData([
      { name: "Name", value: "hello", type: "string" },
      { name: "Age", value: 1, type: "uint8" },
      { name: "Message", value: "hello", type: "string" },
    ]);

    const attestationData = {
      recipient: signer.address,
      // Unix timestamp of when attestation expires. (0 for no expiration)
      expirationTime: 0,
      // Unix timestamp of current time
      time: unix,
      revocable: true,
      version: 1,
      nonce: 0,
      schema:
        '0xce14a7c836514d0169d745dab143e83b7777c78d04616f3edd604c1bd0aed716',
      refUID:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: encodedData
    }

    const response = await offchain.signOffchainAttestation(
      attestationData,
      signer
    )
    const isValid = await offchain.verifyOffchainAttestationSignature(
      signer.address,
      response
    )

    setIsValidSignature(isValid)
  }

  return (
    <div>
      <h1>Ethereum Attestation Service</h1>
      <p>
        The attestation signature is {isValidSignature ? 'valid' : 'invalid'}
      </p>
      <button onClick={createAttestation} className="w-72 p-2 mt-4 text-black rounded-md bg-slate-400" >Create Attestation</button>
    </div>
  )
}


export default EASFormOffChain;


// import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
// import { ethers } from "ethers";
// import { useState } from "react";

// const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

// function EASFormOffChain() {
//   const [name, setName] = useState("");
//   const [age, setAge] = useState(0);
//   const [address, setAddress] = useState("");
//   const [message, setMessage] = useState("");
//   const [submitUID, setSubmitUID] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   const submitAttestation = async () => {
//     setSubmitUID("");

//     const unix = Math.round(+new Date()/1000);

//     const eas = new EAS(EASContractAddress);
//     // eas.connect(signer);

//     const offchain = await eas.getOffchain();

//     const schemaEncoder = new SchemaEncoder("string Name, uint8 Age, string Message");
//     const encodedData = schemaEncoder.encodeData([
//       { name: "Name", value: name, type: "string" },
//       { name: "Age", value: age, type: "uint8" },
//       { name: "Message", value: message, type: "string" },
//     ]);

//     const schemaUID = "0xce14a7c836514d0169d745dab143e83b7777c78d04616f3edd604c1bd0aed716";

//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();

//     eas.connect(signer);

//     const tx = await offchain.signOffchainAttestation({
//         recipient: address,
//         expirationTime: 0,
//         time: unix,
//         revocable: false,
//         version: 1,
//         nonce: 0,
//         schema: schemaUID,
//         refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
//         data: encodedData,
//     }, signer);

//     setLoading(true);

//     const newAttestationUIDOffChain = await tx.wait();

//     setLoading(false);

//     setSubmitUID(newAttestationUIDOffChain);

//     setName("");
//     setAge(0);
//     setAddress("");
//     setMessage("");
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <input
//         className="w-72 p-2 mt-12 text-black rounded-md"
//         type="text"
//         placeholder="Enter Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         className="w-72 p-2 mt-4 text-black rounded-md"
//         type="number"
//         placeholder="Enter Age"
//         value={age}
//         onChange={(e) => setAge(e.target.value)}
//       />
//       <input
//         className="w-72 p-2 mt-4 text-black rounded-md"
//         type="text"
//         placeholder="Enter Address..."
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />
//       <input
//         className="w-72 p-2 mt-4 text-black rounded-md"
//         type="text"
//         placeholder="Enter Message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button
//         onClick={submitAttestation}
//         className="w-72 p-2 mt-4 text-black rounded-md bg-slate-400"
//       >
//         Submit Attestation
//       </button>
//       {loading && <p className="mt-4">Loading...</p>}
//       {submitUID && (
//         <div className="mt-4">
//           New Attestation Subbmited with UID: {submitUID}
//         </div>
//       )}
//     </div>
//   );
// }
