import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Payment } from './payment'

const Login = () => {
  const wallet = useWallet()

  /** show payment UI if wallet is connected */
  if (wallet.connected) return <Payment />

  return (
    <div className={styles.loginPage}>
      <h2 className={styles.text}>Welcome to Inspify Web3 Streaming Platform</h4>
      <p className={styles.text}>Login to access this app</p>
      <WalletMultiButton />
    </div>
  )
}

export default Login

const styles = {
  loginPage: `w-screen h-screen bg-white flex justify-center flex-col items-center`,
  text: `text-4xl text-black mb-10`,
}
