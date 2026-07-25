import {
  Beef,
  Flame,
  Leaf,
  Wheat,
} from "lucide-react";

function NutritionCard({ nutrition }) {
  const items = [
    {
      label: "Calories",
      value: `${nutrition.calories} kcal`,
      icon: <Flame size={19} />,
    },
    {
      label: "Protein",
      value: `${nutrition.protein} g`,
      icon: <Beef size={19} />,
    },
    {
      label: "Carbs",
      value: `${nutrition.carbohydrates} g`,
      icon: <Wheat size={19} />,
    },
    {
      label: "Fiber",
      value: `${nutrition.fiber} g`,
      icon: <Leaf size={19} />,
    },
  ];

  return (
    <aside className="nutrition-card">
      <p className="recipe-kicker">Estimated nutrition</p>
      <h3>Per serving</h3>

      <div className="nutrition-grid">
        {items.map((item) => (
          <div className="nutrition-item" key={item.label}>
            <span className="nutrition-icon">{item.icon}</span>

            <div>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fat-row">
        <span>Fat</span>
        <strong>{nutrition.fat} g</strong>
      </div>

      <p className="nutrition-note">
        Values are approximate and may vary depending on the exact
        ingredients and quantities used.
      </p>
    </aside>
  );
}

export default NutritionCard;