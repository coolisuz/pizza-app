import { formatCurrency } from "../../utilities/helpers";
import Button from '../../ui/Button';
import { addItem, getCurrenQuantityById } from '../cart/cartSlice'
import { useDispatch, useSelector } from "react-redux";
import DeleteItemButton from "../cart/deleteItem";
import UpdateItemQuantity from "../cart/UpdateItemQuantity";


function MenuItem({ pizza }) {
  const dispatch = useDispatch();
  
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  
  const currentQuantity = useSelector(getCurrenQuantityById(id));
  const isInCart = currentQuantity > 0;

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name, 
      quantity: 1,
      unitPrice,
      total: unitPrice * 1
    }

    dispatch(addItem(newItem))
  }

  return (
    <li className="text-stone-800 flex gap-4 py-2">
      <img src={imageUrl} alt={name} className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}/>
      <div className="flex flex-col grow pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm italic text-stone-500 capitalize">{ingredients.join(", ")}</p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? <p>{formatCurrency(unitPrice)}</p> : <p className="text-sm uppercase font-medium text-stone-500">Sold out</p>}
          <div className="ml-2">
            { isInCart && <div className="flex gap-4 items-center sm:gap-8">
              <UpdateItemQuantity currentQuantity={currentQuantity} pizzaId={id}/>
              <DeleteItemButton pizzaId={id}/>
            </div> }
            {!soldOut && !isInCart && <Button type='small' onClick={handleAddToCart}>Add to cart</Button>}
          </div>
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
