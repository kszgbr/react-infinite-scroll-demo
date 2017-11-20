## about
 Demo for a possible implementation of a basic infinite scroll component.

## scroll container attributes
 - **dataset:** array of data to be displayed
 - **itemOverflow:** the component will prerender this many items to the scroll area on paging.
 - **itemHeight:** height (in pixels) of the react component that will display the data in the scroll area.
 - **itemFactory:** a function that will return the desired react component which displays the data. Takes the data as argument and returns the react component.

## build and run
 - npm install
 - npm run build
 - npm run start
 - it should be up and running on localhost:8080
