import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe serbings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remoce bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Sucess message
    addRecipeView.renderMessage();

    // Render bookmar view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandleRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addhandlerAddBookmaek(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome');
};
init();

/*
///////////////////////////////////////
// LECTURES
///////////////////////////////////////
// Project Overview and Planning (I)

// ATENTION: This is the Final Project, so we will use everythin we learn in the course

///////////////////////////////////////
// Loading a Recipe from API

// It is pretty common to store the assets of the project in a scr folder

// sass is a nicer way of writing CSS, but browsers cannot read sass, so use Parcel to convert it

// REMEMBER: Use npm init

// REMEMBER: The npm commands

// It is common to reformat the name of the Properties of an Object that was the result of an AJAX call

///////////////////////////////////////
// Rendering the Recipe

// REMEMBER: The DOM Manipulation Methods

// REMEMBER: The innerHTML Property

// REMEMBER: The Array Methods

// REMEMBER: The join() Method

// When creating an HTML String, when using Parcel you'll need to tell Parcel the place of the element (image) by importing it, and using this import in the place you want. But importing this way is made in Parcel 1
// Now in Parcel 2, when importing you need to write url: before the path of the document, this is only valid for files that are NOT Scripts. and this will simply return the path to the file

// Parcel can import more than just Scripts

// You can go up the folder Tree while importing too, use .. to do that

// You can download more than one package at the same time using NPM

// The core-js package is use for Polyfilling all the code and the regenerator-runtime is used to Polyfill Async Functions

///////////////////////////////////////
// Listening For load and hashchange Events

// The hash is everything that comes after the hash (#), e.g #123456879. The hash also incluse the #. The hash is usually associated with a link, or an id, is basically a way to access a website or some data from the website

// You can listen for an Event for when the hash changes, this event is called in the window Object with the addEventListener, and the Event Handler is called 'hashchange'

// You can see the current hash of the project by using the window.location.hash

// REMEMBER: The String Methods

// REMEMBER: The 'load' Event

// An Error can occur that the 'hashchange' Event will not fire when you copy the url, to fix that simply create a 'load' Event

// If you need to add a lot of Events in the same Element, you can simply loop through an Array that contain the Events and then add them to the Element you want

// REMEMBER: The Guard Clauses

///////////////////////////////////////
// The MVC Architecture

// The Architecture will give the Sctructure so that we can write our code
// The Structure is how we organize and divide our code

// The Architecture will make easier for us to maintain our code in the future
// And it will make it better for us to implement new Features, this part is called Expandability

// We can create our own Architecture or use a well-stablished Achitecture pattern, like MVC, MVP, etc

// Today it is common to use a library or FrameWork to create this Architecture, like React, Angular, etc

// There are some Components that all Architectures must have
// Business Logic: is the code related to what business does and what it needs, basically it is the code that solves the problem o the actual business
// State: is what stores all the data of the application. This should be a Single source o truth, and als should be in sync with the UI. There is many state managements libraries
// HTTP Library: is responsible for recieving and requesting AJAX calls
// Application Logic (Router): it is the code that is concerned only about the implementation of the own application, it doesn't have much to do with the business problem, is more about the technical part of the application. It handles the Navigation and the UI Events
// Presentation Logic (UI Layer): it is the code that represents the visible part of the application. It will basically display the application State on the UI to keep everything in sync

// The MVC (Model View Controller) Architecture Pattern:
// This pattern have 3 major parts =>
// Model: manage the applications data. So basically it will take care of the State and the Business Logic. And also it may have the HTTP Library, that will make a connection between the Model and the Web Server
// Controller: contains the Application Logic. This will created a link between the Model and the View since they don't know nothing about each other> Also the Controller will dispatch tasks to the Model and the View
// View: takes care of the Presentation Logic, and interacts with the User

// The main goal of MCV is to separate the Business Logic from the Application Logic, but you still need a connection between them

// REMEMBER: The Controller will give instructions for the Model and the View. And also the Model and the View doesn't know about the Controller

///////////////////////////////////////
// Refactoring for MVC

// The Model, Controller and View of the MCV can be stored in different files, that can be modules or just Scripts

// You can separate parts of the code in different files even if they are all Views, Models or even Controllers

// REMEMBER: The Import/Export Statements
// REMEMBER: The Modules concepts

// REMEMBER: There is a Live Connection between the Imports and Exports

// REMEMBER: There are Named Exports and Default Exports

// REMEMBER: You can import everything in a Module with *, and you can change the name with as

// REMEMBER: An Async Function will return a Promise, that can be consumed

// When Refactoring a code remember to always see if the code is working after you change something

// REMEMBER: Classes can share their Methods to a child (extended) Class

// You can exports Classes too

// REMEMBER: The Class concepts

// It is common to prepend control, view, etc according with the type of functionality of the Function

// REMEMBER: To call the Functions and Methods when need it

// The Fractional Library allows you to create fractions based on given Numbers

// The name to import the Fractional Library is 'fractional'

// To create a new Fraction use the new Keyword and then the name that you used to import the library and then the Fraction() Method, or you can use Destructurig when importing the Library
// And then after creating a Fractiona nd passed the Values, you convert this Fraction using the toString() Methods

// REMEMBER: The this KeyWord on Classes

///////////////////////////////////////
// Helpers and Configuration Files

// The project can have 2 separated Modules, one for Congfigurations. And another one for Helper Function that are going to be generic and used in the entire project

// In the Configuration Module, you going to store all the Const Variables that are going to be used in the entire project. By doing this will help you configure the entire application by simply changing the Variables in that file
// The stored Variables in the Configuration Module are going to be those that define some important data about the application itself, and then you can export those Variables

// It is a convention to name constants that are never going to change in upercase

// The Helpers Module is going to have some Functions that are going to be reused over and over again throughout the project

// REMEMBER: To return the data qhen necessary

// REMEMBER: An Async Function always return a Promise

// If you want to handle a Promise Error in another place, you can simply throw the Error, that is inside the catch Block

// It is common to use setTimout when using Promises

// REMEMBER: The Promise.race() Method

// A Magic Value is a Value that if someone reads it, this person will not understant where this Value is coming from. With Magic Values i is a good idea to put them in the Configuration Module

///////////////////////////////////////
// Event Handlers in MVC: Publisher-Subscriber Pattern

// DOM Events should be listened in a View Script/Module

// DOM Events should be handled in the Controller Script/Module

// REMEMBER: The View and Model doesn't know about the Controller

// Design Pattern are simply standarts solution for certain problems

// You can make the View or Model know about the Controller through the Publisher Subscriber Pattern

// In the Publisher Subscriber Pattern, there is the Publisher, that is a code that knows when to react and there is also a Subcriber, that is the code that want to react
// And now you can subiscribe to the Publisher by passing the Subscriber Function. Basically you simply pass the Subscriber Function as Argument to the Publisher Function

// It is common to create a Function with the name init, and this Function will be called once when the application starts

///////////////////////////////////////
// Implementing Error and Sucess Messages

// It is common to display a message when an Error happens. And when using the MCV rememebe that you're going to display the Error in the View

// REMEMBER: How the Error Popagation in Promises work, and to throw Errors when necessary

// REMEMBER: How the this KeyWord works on Classes

// REMEMBER: You can set default Values for Parameters

// It is good to have sucess messages too

// REMEMBER: The Class Fields

///////////////////////////////////////
// Implementing Search Results - Part 1

// Sometimes it is easy to start with the Model

// To use a link to search for stuff you can use the ? and then a Parameter, like search and you set this Parameter equal (=)

// REMEMBER: The async/await and the Template Literal

// Usually a URL ends with a slash /

// If the await Statement is not going to return anything, then there is no need to store the Value in a Variable

// It is better to separate the Views, when they have different functionality or for when they are too far apart in the UI

// You can export Classes as Default

// REMEMBER: querySelector() always goes down the DOM Tree

// REMEMBER: Guard Clauses

// After importing a Class, you can select all the Public APIs in that Class, as if it was with a Object Literal (object.property)

// REMEMBER: The Publisher-Subscriber Pattern, this pattern is basically to call the Function in the controller, but only handle the Event in the View

// You can use the 'submit' Event in the form, buy adding the Event Listener in the form

// REMEMBER: The preventDefault() and that the submit Event reloads the page

// REMEMBER: To keep some kind of pattern in the name that you give to things

// It is common to clear a form field after using it or submiting it

// It is always good to write some comments

// REMEMBER: To call the Function when need it

///////////////////////////////////////
// Implementing Search Results - Part 2

// REMEMBER: You can create Parent Classes with the extends KeyWord

// REMEMBER: You can either export the entire Class or only an Instance of that Class

// REMEMBER: The _ convention for Protected Methods

// REMEMBER: Prototypal Inheritance and how this affect Classes

// REMEMBER: The Arrays and Strings Methods

// REMEMBER: The Hot Module code and what it will do. The Hot Module will not reload the entire page, some of the State will remains

// REMEMBER: How the this KeyWord works in a Class

// REMEMBER: The Truthy and Falsy Values

// You can check if a Value is an Array by using the Array.isArray() Method. It will take a Value to be checked as an Argument

// REMEMBER: The length Property on Objects and Arrays

// You can make a comparisson by using the (), this will make that the () will only be true if everything inside the () is true

///////////////////////////////////////
// Implementing Pagination - Part 1

// It is good to do User Friendly Features, like not show all the search results at once, but use pagination and only show a few

// REMEMBER: The Array is 0 based

// To do a pagination you will need to slice a results array with only the data that you want to display in the page

// To calculate the start of the slice you can use: (currPage - 1) * Number of element that you want to show in the page. And foe the end you simply: page * Number of element that you want to show in the page

// REMEMBER: The slice() Method does includes the end Value

// REMEMBER: The configuration file and when to use it

// REMEMBER: You can import more than one named export at once

// Sometimes you may need to restart Parcel

// REMEMBER: Default Parameters

///////////////////////////////////////
// Implementing Pagination - Part 2

// When creating a Pagination you need to check for a lot of cenarios, and most of then are based on the current page

// To get the amount of pages that you will have simply do this: all the results (length) / the amount of results per page

// If you don't return anything in a Function, Undefined will be returned as default

// REMEMBER: The Math Methods

// You may also check if in the page 1 the Number of Pages is greater than 1. The last page will be equal to the number of pages. For other pages then, the current page will be less than the number of pages. And if you only have 1 page thenyou simply return nothing

// REMEMBER: The DRY Concept

// REMEMBER: The Publisher-Subcriber Pattern

// REMEMBER: Event Delegation and e.target. And also the DOM Manipulation Methods

// You can set a connection between the DOM and JavaScript, you can do this by using the Custom Data Attribute

// REMEMBER: How to access the Custom Data Attribute, you can use the dataset Property

// REMEMBER: You can convert a String into a Number by simply adding a + before the Value

///////////////////////////////////////
// Project Planning II

///////////////////////////////////////
// Updating Recipe Servings

// REMEMBER: How the MCV (Model Controller View) Architecture works

// REMEMBER: Sometimes you need to create a State Variable that holds the Value of a current actions

// When you're using Async Functions, you will have to wait until that Value finishes loading to be able to use it

// REMEMBER: Event Delegation

// REMEMBER: You can connect the DOM with JavaScript by using the Custom Data Attribute

// REMEMBER: If you're using Custom Data Attribute and you use - in the HTML after the first name of the data, then this - will be converted into a CamelCase

// REMEMBER: Destructuring Arrays and Objects

///////////////////////////////////////
// Developing a DOM Updating Algorithm

// It is not wise to rerender everything if only a small part of the application will be updated

// The createRange() Method that is attached to the document Object, will basically create a range, and you can call another Method called createContextualFragment().
// The createContextualFragment() will recieve an String with HTML inside of it, and then the String will be converted into real DOM Nodes and Objects. Basically is a DOM Element that lives on the Memory and not in the page itself

// If you simply put a "*" as the selector on a querySelectorALl(), this will make the Method select all child Element of the attached DOM Element

// To do the comparison, you will need the new DOM (by using the createContextualFragment()) and the current DOM> And you will only change if some of the Values are diferent, and you will set the current textContent to the new textContent basically, but this will change the entire container
// And you can use a Method that is on all Node, the Method is nodeValue() and it will make so that the container is not entirely replaced. The nodeValue() Property will simply access the Value of a Node

// REMEMBER: The Array.from() Method

// REMEMBER: In some Array Method you can have access to the current Value, the current Index, and the entire Array itself

// You can compare the DOM Nodes by using the isEqualNode() Method, this Method will be attached to a Node and it will also recieve a Node as Argument, but the Method will only compare the content of the Nodes

// REMEMBER: The Advanced DOM Manipulation Methods and Properties

// REMEMBER: The diferent types of Nodes and their hierarquy

// REMEMBER: The trim() Method

// REMEMBER: Optional Chaining

// Whenever an Element changes you calso may want to change its Attributes

// You can access a Node Attribute by using the attribute Property

// REMEMBER: You can set an Attribute by using the setAttribute() Method. And you can access the Value and Name of an Attribute by using the value and name Properties

// REMEMBER: You can get the current id of the application by using the window.location.hash

///////////////////////////////////////
// Implementing Bookmarks - Part 1

// REMEMBER: The idea of a State Variable

// REMEMBER: Event Delagation, and it is impossible to listen for an Event in a Element that doesn't exist

// REMEMBER: The closest() Method and the target Property on an Event

// REMEMBER: Guard Clauses

// REMEMBER: The some() Method

// It is common that when you getting data you usually get the whole Object (data), and when you delete data you simply get the part that you need

// REMEMBER: The splice() Method

// REMEMBER: The findIndex() Method

///////////////////////////////////////
// Implementing Bookmarks - Part 2

///////////////////////////////////////
// Storing Bookmarks With localStorage

// REMEMBER: localStorage is an API

// REMEMBER: The JSON.stringify() Method, and its usages in LocalStorage

// REMEMBER: The JSON.parse() Method

// REMEMBER: The console.error()

// REMEMBER: How to use the debugger

// REMEMBER: The 'load' Event

// REMEMBER: The Publisher-Subscriber Pattern

// It is common to have some Functions only for development, like a debugger Function

///////////////////////////////////////
// Project Planning III

///////////////////////////////////////
// Uploading a New Recipe - Part 1

// REMEMBER: Sometimes you only need to do some DOM Manipulaltion for the application to work

// REMEMBER: The DOM Manipulation Methods

// REMEMBER: The toggle() Method on a classList

// REMEMBER: The contructor() and super() Method on a Class, and that the constructor() can run Functions imediatelly as the Object gets created

// REMEMBER: The this Keyword will point to the Element that is attached to the Event Listner, you can change that by using the bind() Method

// REMEMBER: The preventDefault() Method and Event Delegation

// The new Api for forms, you can use it by writing the new Keyword and then the FormData() Constructor, this Constructor will recieve an Element that is a Form as Argument
// And then this API will return a Object that can be spread by using the Spread Operator, and this Array will contain all the Fields with all the Values in there

// REMEMBER: The Publisher Subscriber Pattern

// You can convert entries into an Object by using the Object.fromEntries() Method, this Method will get the entries as an Argument. This is basically the oposite of the Object.entires() Method

///////////////////////////////////////
// Uploading a New Recipe - Part 2

// REMEMBER: The Async/Await Function

// It is good the return the same type of Data that you recieve

// REMEMBER: The Array Methods

// REMEMBER: The Object.entries() Method

// REMEMBER: The startsWith() Method

// REMEMBER: The split() Method

// REMEMBER: The replace() and replaceAll() Methods

// REMEMBER: That you can descontruct Arrays and Objects

// REMEMBER: You can throw new Errors

// REMEMBER: console.error() and the try/catch Statements

// REMEMBER: The Errors have a message Property

// REMEMBER: An Async Function always returns a Promise

// You can send data using the fetch() Method, to do this you add as Second Argument an Object of options. On this Object you can add the properties: method (which can be 'POST' or 'GET'), headers (another Object that conatins some information about the request itself, and you must add the Property 'Content-Type', which can have the Value of 'application/json', which means that the information sent will be in the JSON format), body (which is the data that you are sending, and need to be the same type of data that you specified in the 'Content-Type')

// REMEMBER: LocalStorage

// REMEMBER: Short Circuiting

// This trick can conditionally add Properties to an Object:     ...(recipe.key && { key: recipe.key }),

// REMEMBER: The timers Methods, like setTimeout() and setInterval()

// REMEMBER: To nover use a 'Magic Number', instead create a configuration file and add those Values there

///////////////////////////////////////
// Uploading a New Recipe - Part 3

// You can use the History API, will have the history of the browser, and this API is attached to the window Object. And on the history Object you can use the pushState() Method to add something without reloading the page
// The pushState() Method takes 3 Arguments, the first one is the State, the second one is the Title (string), and the third one is the URL

// You can use the back() Method to go back one page, this Method is attached to the History API

// REMEMBER: The Ternary Operator

// REMEMBER: The trim() Method

///////////////////////////////////////
// Wrapping Up: Final Considerations

// There is a Standart way of writing JavaScript Documentation, and that is called JSDocs

// You can find more information at jsdocs.app

// To create a JSDoc you need to write a comment with /*, but you will use 2 * (starts) at the begining

// In the fisrt * you will write a description of the Function. And on the ones that have @param, inside the {} you write the type of data that the Parameter will recieve, and fater the {} is the name of the Paramenter, and after the name of the Parameter you can write a description of the Parameter
// You can say that a Parameter is opitional by puttin the name of the Parameter inside the [], and you can sey if that Paramter has a Default Value, to do that simply write = and then the Value
// You can use the | for 'or'

// The JSDocs is better for other people to read and understand the Functions you wrote

// You can also say what the Function will return, simply add another * and the @returns. And the concepts for the Parameters works the same here

// And you can say where the this KeyWord points to. And to do that simply add another * and the @this, and the concepts for the Parameters works the same here

// You can also add the @author, and @todo, which is just what you need to do in the Function
*/
