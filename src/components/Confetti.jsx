import Lottie from 'lottie-react'
import confettiAnimation from '../assets/animations/Confetti-Animation.json'

const Confetti = () => (
  <div className="confetti">
    <Lottie
      animationData={confettiAnimation}
      loop={false}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
    />
  </div>
)

export default Confetti


