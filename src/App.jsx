import { useEffect, useState } from 'react'
import cardImg1 from './assets/cards/Back Card - 1.png'
import cardImg2 from './assets/cards/Back Card - 2.png'
import cardImg3 from './assets/cards/Back Card - 3.png'
import cardImg4 from './assets/cards/Back Card - 4.png'
import cardImg5 from './assets/cards/Back Card - 5.png'
import cardImg6 from './assets/cards/Back Card - 6.png'
import cardImg7 from './assets/cards/Back Card - 7.png'
import cardImg8 from './assets/cards/Back Card - 8.png'
import cardImg9 from './assets/cards/Back Card - 9.png'
import cardImg10 from './assets/cards/Back Card - 10.png'
import cardImg11 from './assets/cards/Back Card - 11.png'
import cardImg12 from './assets/cards/Back Card - 12.png'
import cardImg13 from './assets/cards/Back Card - 13.png'
import frontCard1 from './assets/cards/Front Card - 1.png'
import frontCard2 from './assets/cards/Front Card - 2.png'
import blankCard from './assets/cards/Front Card - 3.png'
import MemoryCard from './components/MemoryCard'
import Confetti from './components/Confetti'
import './App.css'

const BASE_REWARDS = [
  { key: 'chicolastic', label: 'Chicolastic wipes', image: cardImg1 },
  { key: 'bio-baby', label: 'Bio Baby diapers', image: cardImg2 },
  { key: 'elite-classic', label: 'Elite Cuidado Clásico', image: cardImg3 },
  { key: 'elite-box', label: 'Elite tissue box', image: cardImg4 },
  { key: 'elite-250', label: 'Elite 250 roll', image: cardImg5 },
  { key: 'kiddies', label: 'Kiddies Antifugas', image: cardImg6 },
  { key: 'affective', label: 'Affective Active', image: cardImg7 },
  { key: 'bbtips-wipes', label: 'bbtips wipes', image: cardImg8 },
  { key: 'elite-ultra-suave', label: 'Elite Ultra Suave', image: cardImg9 },
  { key: 'elite-soft-strong', label: 'Elite Soft & Strong', image: cardImg10 },
  { key: 'elite-soft-black', label: 'Elite Soft & Strong black pack', image: cardImg11 },
  { key: 'elite-ultra-abs', label: 'Elite Ultra Absorbente rollo', image: cardImg12 },
  { key: 'bbtips-diaper', label: 'bbtips Sensitive diaper pack', image: cardImg13 },
]
const BLANK_PAIRS = 10
const BLANK_REWARDS = Array.from({ length: BLANK_PAIRS }, (_, index) => ({
  key: `mystery-${index + 1}`,
  label: `Mystery reward ${index + 1}`,
  image: blankCard,
  isMystery: true,
}))
const CARD_REWARDS = [...BASE_REWARDS, ...BLANK_REWARDS]
const FRONT_FACES = [frontCard1, frontCard2]

const TOTAL_CARDS = 20
const MATCHABLE_PAIR_TARGET = 10

if (MATCHABLE_PAIR_TARGET * 2 > TOTAL_CARDS) {
  throw new Error('MATCHABLE_PAIR_TARGET exceeds the grid capacity.')
}

if (MATCHABLE_PAIR_TARGET > BASE_REWARDS.length) {
  throw new Error('Not enough reward images to satisfy the requested deck configuration.')
}

const BEST_TIME_STORAGE_KEY = 'match2-best-time'

const shuffleDeck = (cards) => {
  const stack = [...cards]
  for (let i = stack.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[stack[i], stack[j]] = [stack[j], stack[i]]
  }
  return stack
}

const buildDeck = () => {
  const pool = shuffleDeck(BASE_REWARDS)
  let faceIndex = 0

  const createCard = (reward, suffix) => {
    const frontImage = FRONT_FACES[faceIndex % FRONT_FACES.length]
    faceIndex += 1
    return {
      id: `${reward.key}-${suffix}`,
      rewardKey: reward.key,
      label: reward.label,
      image: reward.image,
      frontImage,
      isFlipped: false,
      isMatched: false,
    }
  }

  const pairRewards = pool.slice(0, MATCHABLE_PAIR_TARGET)

  const pairCards = pairRewards.flatMap((reward, index) => [
    createCard(reward, `pair-${index}-a`),
    createCard(reward, `pair-${index}-b`),
  ])

  return shuffleDeck(pairCards)
}

const readBestTime = () => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(BEST_TIME_STORAGE_KEY)
  return stored ? Number(stored) : null
}

const writeBestTime = (value) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(BEST_TIME_STORAGE_KEY, String(value))
}

const formatTime = (totalSeconds) => {
  const safeSeconds = Number.isFinite(totalSeconds) ? totalSeconds : 0
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function App() {
  const [cards, setCards] = useState(() => buildDeck())
  const [flippedIds, setFlippedIds] = useState([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [bestTime, setBestTime] = useState(() => readBestTime())
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!isRunning) return undefined
    const timerId = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timerId)
  }, [isRunning])

  useEffect(() => {
    if (matches === MATCHABLE_PAIR_TARGET) {
      setHasWon(true)
      setIsRunning(false)
    }
  }, [matches])

  useEffect(() => {
    if (!hasWon) return
    setBestTime((prev) => {
      if (prev === null || secondsElapsed < prev) {
        writeBestTime(secondsElapsed)
        return secondsElapsed
      }
      return prev
    })
  }, [hasWon, secondsElapsed])

  const evaluatePair = (pairIds) => {
    setIsBusy(true)
    setMoves((prev) => prev + 1)

    const [firstId, secondId] = pairIds
    const firstCard = cards.find((card) => card.id === firstId)
    const secondCard = cards.find((card) => card.id === secondId)

    if (firstCard && secondCard && firstCard.rewardKey === secondCard.rewardKey) {
      setCards((current) =>
        current.map((card) =>
          pairIds.includes(card.id)
            ? { ...card, isMatched: true, isFlipped: true }
            : card,
        ),
      )
      setMatches((prev) => prev + 1)
      setFlippedIds([])
      setIsBusy(false)
      return
    }

    setTimeout(() => {
      setCards((current) =>
        current.map((card) =>
          pairIds.includes(card.id) ? { ...card, isFlipped: false } : card,
        ),
      )
      setFlippedIds([])
      setIsBusy(false)
    }, 800)
  }

  const handleFlip = (cardId) => {
    if (isBusy || hasWon) return
    const targetCard = cards.find((card) => card.id === cardId)
    if (!targetCard || targetCard.isFlipped || targetCard.isMatched) return

    if (!isRunning) {
      setIsRunning(true)
    }

    const updatedDeck = cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card,
    )
    setCards(updatedDeck)

    const nextFlipped = [...flippedIds, cardId]
    setFlippedIds(nextFlipped)

    if (nextFlipped.length === 2) {
      evaluatePair(nextFlipped)
    }
  }

  const startNewGame = () => {
    setCards(buildDeck())
    setFlippedIds([])
    setMoves(0)
    setMatches(0)
    setSecondsElapsed(0)
    setIsRunning(false)
    setIsBusy(false)
    setHasWon(false)
  }

  const timerLabel = formatTime(secondsElapsed)
  const bestTimeLabel = bestTime !== null ? formatTime(bestTime) : '—'
  const pairsRemaining = Math.max(MATCHABLE_PAIR_TARGET - matches, 0)

  if (!hasStarted) {
    return (
      <div className="app app--intro">
        <header className="app__header">
          <div>
            <p className="eyebrow">Match 2</p>
            <h1>Flip, remember, and chase your best score.</h1>
          </div>
          <p className="lede">
            You&apos;ll see {TOTAL_CARDS} cards face down. Tap any two cards to flip them. If they
            show the same reward, they stay revealed. Otherwise, they flip back over.
          </p>
        </header>

        <section className="intro-panel">
          <div className="intro-panel__rules">
            <h2>How to play</h2>
            <ol>
              <li>Tap a card to reveal the reward.</li>
              <li>Tap a second card to try to find its pair.</li>
              <li>Matched pairs stay face up; non-matches flip back.</li>
              <li>Clear all {MATCHABLE_PAIR_TARGET} pairs using as few moves as possible.</li>
            </ol>
          </div>
          <div className="intro-panel__cta">
            <p className="intro-panel__hint">
              Pro tip: watch the timer and track your moves — matching faster and cleaner sets a new
              personal best.
            </p>
            <button
              type="button"
              className="primary-btn intro-panel__button"
              onClick={() => setHasStarted(true)}
            >
              Start game
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="app">
      {hasWon && <Confetti />}
      <header className="app__header">
        <div>
          <p className="eyebrow">Match 2</p>
          <h1>Flip cards, find pairs, keep your streak alive.</h1>
        </div>
        <p className="lede">
          Reveal two cards at a time and memorize their positions. Match all{' '}
          {MATCHABLE_PAIR_TARGET} pairs as quickly and efficiently as you can.
        </p>
      </header>

      <section className="status-panel">
        <div className="stat">
          <p className="stat__label">Moves</p>
          <p className="stat__value">{moves}</p>
        </div>
        <div className="stat">
          <p className="stat__label">Matches</p>
          <p className="stat__value">
            {matches}/{MATCHABLE_PAIR_TARGET}
          </p>
          <p className="stat__hint">
            {pairsRemaining > 0
              ? `${pairsRemaining} pairs left`
              : `All ${MATCHABLE_PAIR_TARGET} pairs found`}
          </p>
        </div>
        <div className="stat">
          <p className="stat__label">Time</p>
          <p className="stat__value">{timerLabel}</p>
          <p className="stat__hint">Best: {bestTimeLabel}</p>
        </div>
        <div className="stat stat--actions">
          <button type="button" onClick={startNewGame} className="primary-btn">
            New game
          </button>
        </div>
      </section>

      <section className={`board ${isBusy ? 'board--locked' : ''}`}>
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onFlip={handleFlip}
            disabled={isBusy}
          />
        ))}
      </section>

      {hasWon && (
        <section className="win-banner">
          <div>
            <p className="eyebrow">You did it!</p>
            <h2>Perfect memory unlocked.</h2>
            <p>
              {`All pairs matched in ${moves} moves and ${timerLabel}. `}
              {bestTime !== null && secondsElapsed === bestTime
                ? 'New personal best!'
                : bestTime !== null
                  ? `Best run: ${bestTimeLabel}.`
                  : ''}
            </p>
          </div>
          <button type="button" onClick={startNewGame} className="secondary-btn">
            Play again
          </button>
        </section>
      )}
    </div>
  )
}

export default App
