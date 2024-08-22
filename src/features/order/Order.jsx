// Test ID: IIDSAT
import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import OrderItem from './OrderItem';
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utilities/helpers";
import { useEffect } from "react";

function Order() {
  const order = useLoaderData();
  const fetcher = useFetcher();

  useEffect(function() {
    if (!fetcher.data && fetcher.state === 'idle') {
      fetcher.load('/menu')
    }
  }, [fetcher])

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;
  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="text-stone-800 px-4 py-6 space-y-6">

      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-xl font-semibold">Order #${id} status</h2>
        <div className="space-x-2">
          {priority && <span className="bg-red-500 rounded-full px-3 py-2 uppercase text-sm text-red-50 tracking-wide">Priority</span>}
          <span className="bg-green-600 rounded-full px-3 py-2 uppercase text-sm text-green-50 tracking-wide">{status} order</span>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>
      
      
      <ul className="divide-y divide-stone-200 border-b border-t">
        { cart.map(item => <OrderItem isLoadingIngredients={fetcher.state === 'loading'} item={item} key={item.pizzaId} ingredients={fetcher?.data?.find(el => el.id === item.pizzaId)?.ingredients ?? []}/>)}
      </ul>


      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p className="text-sm font-medium text-stone-600">Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
