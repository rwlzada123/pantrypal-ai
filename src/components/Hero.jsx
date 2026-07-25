import { Clock3, Sparkles, Sprout } from "lucide-react";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles size={16} />
          Smart meals, less waste
        </span>

        <h1>
          Delicious meals from what you <span>already have.</span>
        </h1>

        <p>
          Add the ingredients in your kitchen. PantryPal creates a practical
          recipe based on your diet, budget, cooking time, and skill level.
        </p>

        <div className="hero-points">
          <span>
            <Sprout size={18} />
            Reduce food waste
          </span>

          <span>
            <Clock3 size={18} />
            Match your available time
          </span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="plate">
          <span className="food food-one">🥦</span>
          <span className="food food-two">🍅</span>
          <span className="food food-three">🍚</span>
          <span className="food food-four">🥕</span>
          <span className="food food-five">🍗</span>
        </div>

        <div className="floating-card card-time">
          <strong>30 min</strong>
          <span>quick dinner</span>
        </div>

        <div className="floating-card card-waste">
          <strong>0 waste</strong>
          <span>use your pantry</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;