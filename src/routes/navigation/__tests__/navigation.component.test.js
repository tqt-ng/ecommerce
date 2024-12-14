import { screen, fireEvent } from '@testing-library/react';
import * as reactRedux from 'react-redux';

import { renderWithProviders } from '../../../utils/test/test.utils';

import Navigation from '../navigation.component';
import { signOutStart } from '../../../store/user/user.action';

describe('Navigation tests', () => {
    test('It should render a sign in link and not sign out link if there is no currentUser', () => {
        renderWithProviders(<Navigation />, { 
            preloadedState: {
                user: {
                    currentUser: null
                }
            }
        });

        const signInLinkElement = screen.getByText(/sign in/i); 
        expect(signInLinkElement).toBeInTheDocument();

        const signOutLinkElement = screen.queryByText(/sign out/i); 
        expect(signOutLinkElement).toBeNull();
    });

    test('It should render sign out link and not sign in link if there is a currentUser', () => {
        renderWithProviders(<Navigation />, { 
            preloadedState: {
                user: {
                    currentUser: {} //currentUser is of type UserData or null, check that UserData can be an empty object?
                }
            }
        });

        const signOutLinkElement = screen.getByText(/sign out/i); 
        expect(signOutLinkElement).toBeInTheDocument();

        const signInLinkElement = screen.queryByText(/sign in/i); 
        expect(signInLinkElement).toBeNull();
    });

    test('It should not render a cart dropdown if isCartOpen is false', () => {
        renderWithProviders(<Navigation />, { 
            preloadedState: {
                cart: {
                    isCartOpen: false,
                    cartItems: [] // so that we can use the text 'Your cart is empty' for testing
                }
            }
        });

        const dropdownTextElement = screen.queryByText(/your cart is empty/i); 
        expect(dropdownTextElement).toBeNull();
    });

    test('It should render a cart dropdown if isCartOpen is true', () => {
        renderWithProviders(<Navigation />, { 
            preloadedState: {
                cart: {
                    isCartOpen: true,
                    cartItems: []
                }
            }
        });

        const dropdownTextElement = screen.getByText(/your cart is empty/i); 
        expect(dropdownTextElement).toBeInTheDocument();
    });

    test('It should dispatch signOutStart action when clicking on the Sign Out link', async () => {
        const mockDispatch = jest.fn();
        jest.spyOn(reactRedux, 'useDispatch').mockReturnValue(mockDispatch);

        renderWithProviders(<Navigation />, {
            preloadedState: {
                user: {
                    currentUser: {}
                }
            }
        });

        const signOutLinkElement = screen.getByText(/sign out/i);
        expect(signOutLinkElement).toBeInTheDocument();

        await fireEvent.click(signOutLinkElement);
        expect(mockDispatch).toHaveBeenCalled();

        const signOutAction = signOutStart();
        expect(mockDispatch).toHaveBeenCalledWith(signOutAction); // dispatch(signOutStart())

        mockDispatch.mockClear();
    });
});