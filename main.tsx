// import all neccessary libraries
import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import { For } from "solid-js";
import { render } from "solid-js/web";
import html from "solid-js/html";

// create a store to allow signals to be independently tracked and modified.
function createLocalStore(initState) {
  const [state, setState] = createStore(initState);
  if (localStorage.todos) setState(JSON.parse(localStorage.todos));
  // create a new computation that runs the given function in a tracking scope, 
  // tracking its dependencies, and rerunning the function whenever the dependencies update
  createEffect(() => (localStorage.todos = JSON.stringify(state)));
  return [state, setState];
}

const App = () => {
  const [state, setState] = createLocalStore({
    todos: [],
    newTitle: "",
    idCounter: 0,
  });
  
  // formatting through html
  // creating new states on click - keeping track of existing task number 
  // adding checkbox feature for finished tasks - removing or adding tasks by clicking +/x
  // added tasks are editable
  return html`
    <center><div style="background-image: url(https://raw.githubusercontent.com/jonabako/To-Do-List-with-SolidJS/main/background.jpg)">
      <br><h3 style="font-family:Comic Sans MS; font-size:30px; background-color:white; opacity: 0.5; transparent;">My To-Do List &#128394</h3>
      <input
        type="text"
        style="font-family:Comic Sans MS"
        placeholder="Enter your task"
        value=${() => state.newTitle}
        oninput=${(e) => setState({ newTitle: e.target.value })}
      />
      <button
        onclick=${() =>
          setState({
            idCounter: state.idCounter + 1,
            todos: [
              ...state.todos,
              {
                id: state.idCounter,
                title: state.newTitle,
                done: false,
              },
            ],
            newTitle: "",
          })}
      >
        &#10133
      </button>
      <${For} each=${() => state.todos}
        >${(todo) =>
          html`
            <div>
              <input
                type="checkbox"
                style="width:50px;"
                checked=${todo.done}
                onchange=${(e) => {
                  const idx = state.todos.findIndex((t) => t.id === todo.id);
                  setState("todos", idx, { done: e.target.checked });
                }}
              />
              <input
                type="text"
                value=${todo.title}
                onchange=${(e) => {
                  const idx = state.todos.findIndex((t) => t.id === todo.id);
                  setState("todos", idx, { title: e.target.value });
                }}
              />
              <button
                onclick=${() =>
                  setState("todos", (t) => t.filter((t) => t.id !== todo.id))}
              >
                &#10060
              </button>
            </div>
          `}
      <//>
      <br>
    </div>
  `;
};

// the browser app entry point
render(App, document.getElementById("app"));

/*
Notes for improvement:
> Managing exceptions (i.e. not allowing an empty task to be added to the list)
> Creating separate tabs for completed/pending tasks corresponding to the tasks that have already been checked by the user
> Flexible shifting of tasks up and down according to user preference/priority (atm the tasks are listed according to input order)
> Managing multiple lists, which can be named and grouped to topic relavance
> Making the app more dynamic overall (animations, effects, sounds, etc...)
*/
