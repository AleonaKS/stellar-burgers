import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import { useActionCreators } from '../../services/hooks';
import {
  ordersUserActions,
  selectOrders
} from '../../services/slices/ordersUserSlice';
import { ingredientsActions } from '../../services/slices/ingredientsSlice';

export const ProfileOrders: FC = () => {
  const { fetchIngredients } = useActionCreators(ingredientsActions);
  const { fetchUserOrders } = useActionCreators(ordersUserActions);
  const orders = useSelector(selectOrders);

  useEffect(() => {
    if (orders.length === 0) {
      fetchIngredients();
      fetchUserOrders();
    }
  }, [orders, fetchUserOrders, fetchIngredients]);

  return <ProfileOrdersUI orders={orders} />;
};
