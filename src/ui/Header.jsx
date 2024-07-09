import { Link } from "react-router-dom";
import SearchOrder from "../features/order/SearchOrder";

function Header() {
  return (
    <div>
      <Link to="/">Pizzeria</Link>
      <SearchOrder />
    </div>
  );
}

export default Header;
