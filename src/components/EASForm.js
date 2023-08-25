import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useState } from "react";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e";

function EASForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitUID, setSubmitUID] = useState("");
  const [loading, setLoading] = useState(false);
  
  const submitAttestation = async () => {
    setSubmitUID("");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const eas = new EAS(EASContractAddress);
    eas.connect(signer);

    const schemaEncoder = new SchemaEncoder("string Name, uint8 Age, string Message");
    const encodedData = schemaEncoder.encodeData([
      { name: "Name", value: name, type: "string" },
      { name: "Age", value: age, type: "uint8" },
      { name: "Message", value: message, type: "string" },
    ]);

    const schemaUID =
      "0xce14a7c836514d0169d745dab143e83b7777c78d04616f3edd604c1bd0aed716";

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address,
        expirationTime: 0,
        revocable: false,
        data: encodedData,
      },
    });

    setLoading(true);

    const newAttestationUID = await tx.wait();

    setLoading(false);

    setSubmitUID(newAttestationUID);

    setName("");
    setAge(0);
    setAddress("");
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center">
      <input
        className="w-72 p-2 mt-12 text-black rounded-md"
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="number"
        placeholder="Enter Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter Address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        className="w-72 p-2 mt-4 text-black rounded-md"
        type="text"
        placeholder="Enter Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={submitAttestation}
        className="w-72 p-2 mt-4 text-black rounded-md bg-slate-400"
      >
        Submit Attestation
      </button>
      {loading && <p className="mt-4">Loading...</p>}
      {submitUID && (
        <div className="mt-4">
          New Attestation Subbmited with UID: {submitUID}
        </div>
      )}
    </div>
  );
}

export default EASForm;