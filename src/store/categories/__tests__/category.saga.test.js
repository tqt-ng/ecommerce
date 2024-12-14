import { call, put } from 'typed-redux-saga/macro';
import { testSaga, expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import { getCategoriesAndDocuments } from '../../../utils/firebase/firebase.utils';
import { fetchCategoriesSuccess, fetchCategoriesFailed } from '../category.action';
import { fetchCategoriesAsync, onFetchCategories, categoriesSaga } from '../category.saga';
import { CATEGORIES_ACTION_TYPES } from '../category.types';

describe('Category saga tests', () => {
    test('categoriesSaga', () => {
        testSaga(categoriesSaga)
            .next()
            .all([call(onFetchCategories)])
            .next()
            .isDone();
    });

    test('onFetchCategories', () => {
        testSaga(onFetchCategories)
            .next()
            .takeLatest(CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START, fetchCategoriesAsync)
            .next()
            .isDone();
    });

    // testSaga is used when the order matters, below we use expectSaga as the order doesn't matter and there are outputs
    // all runs everything in parallel

    test('fetchCategoriesAsync success', () => {
        const mockCategoriesArray = [
            { id: 1, name: 'Category 1'},
            { id: 2, name: 'Category 2'}
        ]

        // resolve promise
        return expectSaga(fetchCategoriesAsync)
        .provide([
            [call(getCategoriesAndDocuments), mockCategoriesArray]
        ])
        .put(fetchCategoriesSuccess(mockCategoriesArray))
        .run();
        // the mockCategoriesArray in the put statement is the 'expected value', the value used will be the 
        // return of the provide statement which is also mockCategoriesArray, which is why the test will pass.
        // If we change mockCategoriesArray in the put statement to [], the test will fail, because
        // the expected value is now [], while the value used is mockCategoriesArray.
    });

    test('fetchCategoriesAsync failure', () => {
        const mockError = new Error('An error occurred')

        return expectSaga(fetchCategoriesAsync)
        .provide([
            [call(getCategoriesAndDocuments), throwError(mockError)]
        ])
        .put(fetchCategoriesFailed(mockError))
        .run();
        // throwError is crucial, if not, it will continue as if success and then use mockError in place of mockCategoriesArray
    });
});