const CONFETTI_PIECES = 80

const Confetti = () => (
  <div className="confetti">
    {Array.from({ length: CONFETTI_PIECES }).map((_, index) => (
      <span key={index} className="confetti__piece" />
    ))}
  </div>
)

export default Confetti


