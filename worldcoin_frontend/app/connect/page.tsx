import { IDKitWidget, solidityEncode, CredentialType } from "@worldcoin/idkit"
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Connect() {

    const address: string = "0x000" // get the user's wallet address

    const onSuccess = async (result: any) => {
    // result is the result of the verification
    // result.verified is true if the verification was successful
    // result.claim is the claim that was verified
    // result.claim_type is the type of claim that was verified
    // result.claim_id is the id of the claim that was verified
    // result.claim_hash is the hash of the claim that was verified
    console.log(result)
    }

    return (
        <>
            <ConnectButton />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <IDKitWidget
                app_id="app_staging_8483971b3b9a3a9c239bf16987cbf618" // must be an app set to on-chain
                action={solidityEncode(['uint256'], ["vote_1"])} // solidityEncode the action
                signal={address} // only for on-chain use cases, this is used to prevent tampering with a message
                onSuccess={onSuccess}
                // no use for handleVerify, so it is removed
                credential_types={[CredentialType.Orb]} // we recommend only allowing orb verification on-chain
            >
                {({ open }) => <button onClick={open}>Verify with World ID</button>}
                </IDKitWidget>
            </main>
        </>
    )
}