import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utilities/helpers";
import { getCart, getCartTotalPrice } from "./cartSlice";

function CartOverview() {
  const cart = useSelector(getCart);
  const totalPrice = useSelector(getCartTotalPrice)
  const totalQty = cart.reduce((acc, cur) => acc + cur.quantity, 0);

  if (!totalQty) return null;

  return (
    <div className="flex items-center justify-between bg-stone-800 text-stone-200 px-4 py-4 text-sm md:text-base uppercase sm:px-6">
      <p className="text-stone-300 font-semibold space-x-4 sm:space-x-6">
        <span>{totalQty > 1 ? `${totalQty} pizzas` : `${totalQty} pizza`}</span>
        <span>{formatCurrency(totalPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
