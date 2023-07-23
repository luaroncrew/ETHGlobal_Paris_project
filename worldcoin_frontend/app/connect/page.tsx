"use client"
import { IDKitWidget, solidityEncode, CredentialType } from "@worldcoin/idkit"
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Connect() {

    const address: string = "0x9FA746b844747f77c6C54F4f88ab71048c608864" // get the user's wallet address

    const onSuccess = async (result: any) => {
        console.log(result)
    }

    return (
        <>
            {/* <ConnectButton /> */}
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