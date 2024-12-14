import { screen, fireEvent } from '@testing-library/react';

import { renderWithProviders } from '../../../utils/test/test.utils';
import ProductCard from '../product-card.component';

describe('Product card tests', () => {
    test('It should add the product item when product card button is clicked', async () => {
        const mockProduct = {
            id: 1,
            imageUrl: 'test',
            name: 'Item A',
            price: 10
        };

        const { store } = renderWithProviders(<ProductCard product={mockProduct} />, {
            preloadedState: {
                cart: {
                    cartItems: []
                }
            }
        })

        const addToCartButtonElement = screen.getByText(/add to cart/i);
        await fireEvent.click(addToCartButtonElement);

        // console.log(store.getState().cart.cartItems);
        expect(store.getState().cart.cartItems.length).toBe(1);
    });
});