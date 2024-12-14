import { AnyAction } from 'redux'; // click to see source code in node_modules

// AC stands for action creator.
// AnyAction extends Action - generic type, which means it can accept a type parameter - see definition in node_modules.
// Action<T extends string = string> (definition in node_modules), here = string means string is the default value 
// for the generic parameter T. In general, T can be a subtype of string (enum?).
// match: a function whose return type is a type predicate (action is ReturnType<AC>). 
// Any object of type Matchable will have its own definition of match, here we just specify the type for match.
// This tells TypeScript that if the function returns true, then action is of type ReturnType<AC>.
// The purpose of this method is to act as a type guard. When you use this method in a conditional statement, 
// if the method returns true, TypeScript will narrow the type of the action variable to the specific 
// action type returned by AC.
// AC & {...} means the resulting type will include both the properties of AC and the properties defined in {...}.
// Note that AC is a function, and in JavaScript functions are objects so they do have properties.
type Matchable<AC extends () => AnyAction> = AC & {
    type: ReturnType<AC>['type'];
    match(action: AnyAction): action is ReturnType<AC>;
}
// AnyAction & { type: string } is an intersection of 2 types, just like AC & {...} above
// For monster rolodex app, getData and useState are functions receiving generics <T>, same for withMatcher<AC> below.
export function withMatcher<AC extends () => AnyAction & { type: string }>(actionCreator: AC): Matchable<AC>;

// The (...args: any[]) syntax allows a function to accept any number of arguments, which are collected into an array named args. 
// The any[] type annotation means that the array can contain elements of any type.
// ... here means the rest operator, note the spread operator is also ..., but these two operators are different.
// In TypeScript, can define the types of a function's arguments using the format of an array - when using rest parameters.
// Note we use rest operator for state in the category.reducer too.
// The same way createAction handles the case with payload and without payload, withMatcher needs to handle AC with arguments.
export function withMatcher<AC extends (...args: any[]) => AnyAction & { type: string }>(actionCreator: AC): Matchable<AC>;

// Above is overloading the function (defining types etc.), now is the definition itself of withMatcher, same process for createAction below
// We will pass in the generics when calling withMatcher, same process for createAction below.
export function withMatcher(actionCreator: Function) {
    const type = actionCreator().type; // what if actionCreator needs arguments to be invoked? the arguments will be passed in automatically?
    // actionCreator is a function, in JS functions are objects so they do have properties.
    // We want to return an object with the properties of actionCreator in addition to type, match.
    // match is to check if the type of the action passed into the reducer (action: AnyAction, action.type) is 
    // the same as the type of the action that actionCreator (fetchCategoriesStart etc) creates (type).
    // Here we don't say what action (argument of match) is, but it is meant for the action being pass into the
    // reducer, when we actually make use of withMatcher/everything we define here in category.reducer.
    return Object.assign(actionCreator, {
        type,
        match(action: AnyAction) {
            return action.type === type;
        },
    });
};

export type ActionWithPayload<T,P> = {
    type: T;
    payload: P;
};

// Is this the same as Action from redux defined in node_modules? No.
// But what we're trying to set up is that this Action and ActionWithPayload (above) that we define are also
// of type/extending AnyAction (imported from redux, defined in node_modules), so we can wrap withMatcher around
// the functions such as fetchCategoriesStart etc in category.action.
export type Action<T> = {
    type: T;
};

export function createAction<T extends string, P>(
    type: T, 
    payload: P
): ActionWithPayload<T,P>;

export function createAction<T extends string>(
    type: T, 
    payload: void
): Action<T>;

export function createAction<T extends string, P>(type: T, payload: P) {
    return { type, payload };
};