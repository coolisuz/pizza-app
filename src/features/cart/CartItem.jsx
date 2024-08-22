import { useSelector } from "react-redux";
import { getCurrenQuantityById } from "./cartSlice";
import DeleteItemButton from "./deleteItem";
import { formatCurrency } from "../../utilities/helpers";
import UpdateItemQuantity from "./UpdateItemQuantity";


function CartItem({ item }) {
  const { pizzaId, name, quantity, total } = item;
  const currentQuantity = useSelector(getCurrenQuantityById(pizzaId));
  
  return (
    <li className="py-3">
      <p className="mb-1 sm:mb-0">
        {quantity}&times; {name}
      </p>
      <div className="flex justify-between items-center sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(total)}</p>
        <UpdateItemQuantity pizzaId={pizzaId} currentQuantity={currentQuantity}/>
        <DeleteItemButton pizzaId={pizzaId}/>        
      </div>
    </li>
  );
}

export default CartItem;
