import { ChefHat } from "lucide-react";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <ChefHat size={20} />
        <strong>PantryPal AI</strong>
      </div>

      <p>
        Recipes and nutrition values are AI-generated estimates. Always check
        allergens and follow safe food-handling practices.
      </p>
    </footer>
  );
}

export default Footer;