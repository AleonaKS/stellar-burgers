import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import {
  orderSliceSelectors,
  orderSliceActions
} from '../../services/slices/orderSlice';
import { useParams } from 'react-router-dom';
import { useActionCreators } from '../../services/hooks';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const { fetchOrderByNumber } = useActionCreators(orderSliceActions);

  const orderData = useSelector(orderSliceSelectors.selectFetchedOrder);

  const ingredients = useSelector(ingredientsSelectors.selectIngredients);
  const isIngredientsLoading = useSelector(
    ingredientsSelectors.selectIsLoading
  );
  const isOrderLoading = useSelector(orderSliceSelectors.selectIsFetching);

  useEffect(() => {
    if (!orderData || orderData.number !== Number(number)) {
      fetchOrderByNumber(Number(number));
    }
  }, [number, orderData, fetchOrderByNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !orderData.ingredients || !ingredients.length)
      return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isIngredientsLoading || isOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
