import PropTypes from 'prop-types'

const MemoryCard = ({ card, onFlip, disabled }) => {
  const { id, label: cardLabel, image, frontImage, isFlipped, isMatched } = card
  const isRevealed = isFlipped || isMatched
  const accessibilityLabel = isMatched
    ? `Matched reward: ${cardLabel}`
    : isRevealed
      ? `Reward showing ${cardLabel}`
      : 'Hidden card'

  const handleClick = () => {
    if (disabled || isRevealed) return
    onFlip(id)
  }

  return (
    <button
      type="button"
      className={`tile ${isRevealed ? 'tile--revealed' : ''} ${isMatched ? 'tile--matched' : ''}`}
      onClick={handleClick}
      disabled={disabled && !isRevealed}
      aria-label={accessibilityLabel}
    >
      <div className={`tile__inner ${isRevealed ? 'tile__inner--flipped' : ''}`}>
        <div className="tile__face tile__face--front" aria-hidden>
          <img src={frontImage} alt="" className="tile__front" />
        </div>
        <div className="tile__face tile__face--back">
          <img src={image} alt={cardLabel} className="tile__image" />
        </div>
      </div>
    </button>
  )
}

MemoryCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rewardKey: PropTypes.string.isRequired,
    frontImage: PropTypes.string.isRequired,
    isFlipped: PropTypes.bool.isRequired,
    isMatched: PropTypes.bool.isRequired,
  }).isRequired,
  onFlip: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

MemoryCard.defaultProps = {
  disabled: false,
}

export default MemoryCard

