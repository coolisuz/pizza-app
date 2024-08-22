import { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getCartTotalPrice } from "../cart/cartSlice";
import EmptyCart from '../cart/EmptyCart'
import store from '../../store'
import { formatCurrency } from "../../utilities/helpers";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

function CreateOrder() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const { username, status: addressStatus, position, address, error: errorAddress } = useSelector(state => state.user);
  const isLoadingAddress = addressStatus === 'loading'

  const [withPriority, setWithPriority] = useState(false);
  const cart = useSelector(getCart);
  const totalPrice = useSelector(getCartTotalPrice)
  const priorityPrice = withPriority ? totalPrice * 0.2 : 0;


  if (!cart.length) return <EmptyCart />



  return (
    <div className="text-stone-900 py-6 px-4">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <div className="grow">
            <input type="text" name="customer" defaultValue={username} required className="input w-full"/>
          </div>
          
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full"/>
            {formErrors?.phone && <p className="text-xs mt-2 bg-red-100 rounded-md text-red-700 p-2">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="relative mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input type="text" name="address" defaultValue={address} disabled={isLoadingAddress} required
              className="input w-full"
            />
            {addressStatus === 'error' && <p className="text-xs mt-2 bg-red-100 rounded-md text-red-700 p-2">{errorAddress}</p>}
          </div>

          {!position.latitude && !position.longitude && <span className="absolute right-1 top-[5px] z-30">
            <Button disabled={isLoadingAddress} type='small' onClick={(e) => {
              e.preventDefault();
              dispatch(fetchAddress());
            }}>Get Position</Button>
          </span>}
        </div>

        <div className="mb-12 flex flex-row items-center gap-2">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400
            focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          /> 
          <label htmlFor="priority" className="font-medium">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name="position" value={position.longitude && position.latitude ? `${position.latitude},${position.longitude}` : ''}/>
          <Button disabled={isSubmitting || isLoadingAddress} type='primary'>
            {isSubmitting ? "Placing order" : `Order now: ${formatCurrency(totalPrice + priorityPrice)}`}
            </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  console.log('order: ', order)
  const errors = {};

  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  const newOrder = await createOrder(order);

  store.dispatch(clearCart())

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
