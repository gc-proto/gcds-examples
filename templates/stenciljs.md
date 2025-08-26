Building a GCDS component with [Stencil.js](https://stenciljs.com/) involves setting up the project, creating the component files, and then building the project for use. Here is a step-by-step guide on how to do it.

### Step 1: Set up a new StencilJS project

First, you'll need to install the Stencil CLI and create a new project. Stencil requires a recent LTS version of Node.js.

1.  Open your terminal.
2.  Run `npm init stencil` to begin the project creation process.
3.  When prompted, select the **component** starter project. This will create a collection of web components that can be used anywhere.
    ```
    ? Select a starter project.

    Starters marked as [community] are developed by the Stencil
    Community, rather than Ionic. For more information on the 
    Stencil Community, please see github.com/stencil-community

    ❯   component                Collection of web components that can be
                                used anywhere
        app [community]          Minimal starter for building a Stencil 
                                app or website
        ionic-pwa [community]    Ionic PWA starter with tabs layout and routes
    ```
4.  Give your project a name when prompted, and the CLI will scaffold a new project with all the necessary files.
    ```
    ✔ Pick a starter › component
    ? Project name › my-first-gcds-component-project
    ```

### Step 2: Understand the project structure and create a new component

Your new project will have a `src/` directory. This is where you'll be working, and inside it, the `src/components/` folder is where your component files are stored.

1.  Inside `src/components/`, create a new folder for your component. A good naming convention is to use the component's tag name, for example, `my-gcds-component`.
2.  Inside this new folder, create a `.tsx` file (e.g., `my-gcds-component.tsx`) to define the component's logic and a `.css` file for styling.

### Step 3: Define the component and its logic

Use the `@Component` decorator to define your component in the `.tsx` file. This decorator tells Stencil what the element's name is, where to find its stylesheet, and if it should use the Shadow DOM.

```typescript
import { Component, h } from '@stencil/core';

@Component({
  tag: 'my-gcds-component',
  styleUrl: 'my-gcds-component.css',
  shadow: true,
})
export class MyGcdsComponent {
  render() {
    return (
      <div>
        <h1>Hello, GCDS!</h1>
      </div>
    );
  }
}
```

The `render()` function in the class returns **JSX**, which is a way of writing HTML within your TypeScript code. This JSX defines the structure of your component.

### Step 4: Add styling and build the project

Add your CSS to the `.css` file you created in Step 2. Stencil's build process will ensure these styles are correctly applied to your component.

Once your component is ready, you can build the project by running:

```bash
npm run build
```

This command creates a production-ready version of your components in the `dist` directory. From there, you can use these compiled components in any web project.

### Step 5: Use your component
To use your newly created GCDS component, you can include it in an HTML file or another web project by importing the compiled JavaScript files from the `dist` directory.

Run a local development server to test them. The easiest way to do this is with a command provided by the Stencil CLI.

### Run the Development Server

To start the local server and view your components, open your terminal in the root directory of your Stencil project and run the following command:

```bash
npm start
```

This command starts a development server with **hot-module reloading**, meaning any changes you make to your component's code will automatically be reflected in your browser without requiring a manual refresh. The server will also automatically open a new browser tab for you to view your components.

### Use the Components

Once the server is running, your components are available in a local development environment. You can use them directly in an HTML file just like any other HTML tag.

For example, if you defined a component with the tag `my-gcds-component`, you can add it to an HTML file and it will be rendered by the browser:

```html
<my-gcds-component></my-gcds-component>
```
Source: [StencilJS Documentation](https://stenciljs.com/docs/getting-started)